
class Scheduler
{
	constructor()
	{
		this.timeStart = null;
		this.timeEnd = null;
		this.eventsAll = [];
		this.eventsInSpecifiedTimeRange = [];
		this.timeslotsInSpecifiedTimeRange = [];

		var timeslotDurationInMinutes = 30;
		this.timeslotDurationInMilliseconds =
			SchedulerTimeslot.durationInMilliseconds;

		var timezoneOffsetInMinutes = new Date().getTimezoneOffset();
		this.timezoneOffsetInMilliseconds =
			timezoneOffsetInMinutes * 60 * 1000;

	}

	static Instance()
	{
		if (Scheduler._instance == null)
		{
			Scheduler._instance = new Scheduler();
		}
		return Scheduler._instance;
	}

	eventAdd(eventToAdd)
	{
		this.eventsAll.push(eventToAdd);
	}

	eventById(eventId)
	{
		return this.eventsInSpecifiedTimeRange.filter(x => x.id == eventId)[0];
	}

	search()
	{
		var d = document;

		var inputTimeStart = d.getElementById("inputTimeStart");
		var inputTimeEnd = d.getElementById("inputTimeEnd");
		var selectEventsInSpecifiedTimeRange =
			d.getElementById("selectEventsInSpecifiedTimeRange");

		var timeStart = new Date(Date.parse(inputTimeStart.value));
		var timeEnd = new Date(Date.parse(inputTimeEnd.value));

		var timeslotsInRange =
			this.timeslotsBetweenTimesFromTo(timeStart, timeEnd);

		selectTimeslotsInSpecifiedTimeRange.innerHTML = "";

		if (timeslotsInRange.length == 0)
		{
			var noEventsInRangeMessageAsOption = d.createElement("option");
			noEventsInRangeMessageAsOption.innerHTML =
				"The specified time range is invalid.";
			selectTimeslotsInSpecifiedTimeRange.appendChild
			(
				noEventsInRangeMessageAsOption
			);
		}
		else
		{
			for (var i = 0; i < timeslotsInRange.length; i++)
			{
				var timeslot = timeslotsInRange[i];
				var timeslotAsOption = timeslot.toDomElementOption();
				selectTimeslotsInSpecifiedTimeRange.appendChild
				(
					timeslotAsOption
				);
			}
		}
	}

	startMonitoring()
	{
		var midnightAsStringHHMM = "00:00";
		var millisecondsPerDay = 24 * 60 * 60 * 1000;

		var now = new Date();

		var localMidnightPrev = now.toISOString();
		localMidnightPrev = localMidnightPrev.substr
		(
			0, localMidnightPrev.lastIndexOf("T")
		) + "T" + midnightAsStringHHMM;

		var localMidnightNext = new Date(
			Date.parse(localMidnightPrev) + millisecondsPerDay
		).toISOString();
		localMidnightNext = localMidnightNext.substr
		(
			0, localMidnightNext.lastIndexOf("T")
		) + "T" + midnightAsStringHHMM;

		var d = document;
		d.getElementById("inputTimeStart").value = localMidnightPrev;
		d.getElementById("inputTimeEnd").value = localMidnightNext;
		
		this.timer = setInterval
		(
			this.startMonitoring_TimerTick.bind(this),
			1000 // millisecondsPerTick
		);
		this.startMonitoring_TimerTick();
	}

	startMonitoring_TimerTick()
	{
		var d = document;
		var inputTimeCurrent = d.getElementById("inputTimeCurrent");
		var now = new Date();
		var nowAsString = now.toISOString();
		nowAsString = nowAsString.substr(0, nowAsString.indexOf("."));
		inputTimeCurrent.value = nowAsString;
	}

	timeAdjustForTimeZone(timeEndAdjust)
	{
		return new Date(timeEndAdjust - this.timezoneOffsetInMilliseconds);
	}

	timeslotById(timeslotId)
	{
		return this.timeslotsInSpecifiedTimeRange.filter(x => x.id == timeslotId)[0];
	}

	timeslotSelected()
	{
		var d = document;
		var selectTimeslot =
			d.getElementById("selectTimeslotsInSpecifiedTimeRange");
		var timeslotSelectedId = selectTimeslot.value;
		return this.timeslotById(timeslotSelectedId);
	}

	timeslotsBetweenTimesFromTo(timeStart, timeEnd)
	{
		this.eventsInSpecifiedTimeRange = this.eventsAll.filter
		(
			x =>
				(x.timeStart >= timeStart && x.timeStart <= timeEnd)
				|| (x.timeEnd >= timeStart && x.timeEnd <= timeEnd)
		);

		this.timeslotsInSpecifiedTimeRange.length = 0;

		var specifiedTimeRangeInMilliseconds = timeEnd - timeStart;
		if (specifiedTimeRangeInMilliseconds < 0)
		{
			alert("Invalid time range!");
		}
		else
		{
			var numberOfTimeslotsInRange = Math.ceil
			(
				specifiedTimeRangeInMilliseconds
				/ this.timeslotDurationInMilliseconds 
			);

			for (var i = 0; i < numberOfTimeslotsInRange; i++)
			{
				var timeslotTimeStart = new Date
				(
					timeStart.getTime() + (i * this.timeslotDurationInMilliseconds)
				);
				var timeslotTimeEnd = new Date
				(
					timeslotTimeStart.getTime() + this.timeslotDurationInMilliseconds
				);
				var eventsInTimeslot = this.eventsInSpecifiedTimeRange.filter
				(
					x =>
						x.timeStart < timeslotTimeEnd
						&& x.timeEnd > timeslotTimeStart
				);
				var timeslot = new Timeslot
				(
					timeslotTimeStart, eventsInTimeslot
				);
				this.timeslotsInSpecifiedTimeRange.push(timeslot);
			}
		}

		return this.timeslotsInSpecifiedTimeRange;
	}

}
