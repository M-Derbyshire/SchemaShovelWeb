export default class Queue
{
	constructor()
	{
		this._queue = [];
	}
	
	enqueue(item)
	{
		this._queue.push(item);
	}
	
	dequeue()
	{
		return this._queue.shift();
	}
	
	peek()
	{
		return this._queue[0];
	}
	
	getLength()
	{
		return this._queue.length;
	}
	
	isEmpty()
	{
		return (this.getLength() === 0);
	}
}