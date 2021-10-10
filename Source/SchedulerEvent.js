
class SchedulerEvent
{
	constructor(name, timeStart, timeEnd, description)
	{
		this.id = IdHelper.Instance().idNext();
		this.name = name;
		this.timeStart = timeStart;
		this.timeEnd =
			timeEnd || new Date(this.timeStart + Scheduler.Instance().timeslotDurationInMilliseconds);
		this.description = description
	}

	toString()
	{
		return this.name + ":" + this.timeStart.toISOString() + "-" + this.timeEnd.toISOString();
	}
}
