import Queue from './Queue';

test("Queue will enqueue an item to the queue", () => {
	
	const q = new Queue();
	const testItem = "test1";
	
	q.enqueue(testItem);
	
	expect(q.dequeue()).toBe(testItem);
	
});

test("Queue will dequeue an item from the queue", () => {
	
	const q = new Queue();
	const testItem = "test2";
	
	q.enqueue(testItem);
	const result = q.dequeue();
	
	expect(result).toBe(testItem);
	expect(q.isEmpty()).toBeTruthy();	
});

test("Queue will peek, but not remove, an item", () => {
	
	const q = new Queue();
	const testItem = "test3";
	q.enqueue(testItem);
	
	const result = q.peek();
	
	expect(result).toBe(testItem);
	expect(q.isEmpty()).toBeFalsy();
});

test("Queue will return its current length", () => {
	
	const q = new Queue();
	const testLength = 10;
	
	for(let i = 0; i < testLength; i++)
	{
		q.enqueue(i);
	}
	
	expect(q.getLength()).toBe(testLength);
	
});

test("Queue will return correct bool value if it's empty", () => {
	
	const q = new Queue();
	
	expect(q.isEmpty()).toBeTruthy();
	
	q.enqueue(1);
	q.dequeue();
	
	expect(q.isEmpty()).toBeTruthy();
});