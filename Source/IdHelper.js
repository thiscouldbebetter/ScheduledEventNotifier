
class IdHelper
{
	constructor()
	{
		this._idCurrent = 0;
	}

	static Instance()
	{
		if (IdHelper._instance == null)
		{
			IdHelper._instance = new IdHelper();
		}
		return IdHelper._instance;
	}

	idNext()
	{
		return this._idCurrent++;
	}
}
