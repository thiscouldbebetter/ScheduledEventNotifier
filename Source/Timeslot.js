
class Timeslot
{
	constructor(timeStart, events)
	{
		this.id = IdHelper.Instance().idNext();
		this.timeStart = timeStart;
		this.events = events;
	}

	static durationInMilliseconds = 30 * 60 * 1000;

	timeEnd()
	{
		var returnValue = new Date
		(
			this.timeStart.getTime() + SchedulerTimeslot.durationInMilliseconds
		);
		return returnValue;
	}

	toDomElementOption()
	{
		var d = document;
		var returnValue = d.createElement("option");
		returnValue.value = this.id;

		var newline = "\n";
		var eventsAsString =
			this.events.map(x => x.toString()).join(newline);

		var timeStartAdjusted =
			Scheduler.Instance().timeAdjustForTimeZone(this.timeStart);
		var timeslotTimeStartAsString = timeStartAdjusted.toISOString();
		timeslotTimeStartAsString = timeslotTimeStartAsString.substr
		(
			0, timeslotTimeStartAsString.length - 8
		);
		if (timeslotTimeStartAsString.endsWith("00:00"))
		{
			timeslotTimeStartAsString =
				timeslotTimeStartAsString.split("T").join(" ");
		}
		else
		{
			timeslotTimeStartAsString = timeslotTimeStartAsString.substr
			(
				timeslotTimeStartAsString.indexOf("T") + 1
			);
		}

		var timeslotAsString =
			timeslotTimeStartAsString
			+ eventsAsString

		returnValue.innerHTML = timeslotAsString;
		return returnValue;
	}	
}
