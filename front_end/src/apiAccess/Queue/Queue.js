/** A standard implementation of a Queue data structure */
class Queue
{
	/** Create a new Queue instance */
	constructor()
	{
		this._queue = [];
	}
	
	/** 
	* Add an item to the queue 
	* @param item - The item to add to the queue
	*/
	enqueue(item)
	{
		this._queue.push(item);
	}
	
	/**
	* Retrieve and remove the next item from the queue
	* @return The item that was removed from the queue
	*/
	dequeue()
	{
		return this._queue.shift();
	}
	
	/**
	* Retrieve (but don't remove) the next item from the queue
	* @return The next item from the queue
	*/
	peek()
	{
		return this._queue[0];
	}
	
	/**
	* Get the current length of the queue
	* @return {number} The current length of the queue
	*/
	getLength()
	{
		return this._queue.length;
	}
	
	/**
	* Returns a boolean, which confirms if the queue is currently empty
	* @return {boolean} Is the queue currently empty?
	*/
	isEmpty()
	{
		return (this.getLength() === 0);
	}
}

export default Queue;