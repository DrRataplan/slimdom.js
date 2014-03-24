define(
	[
		'slimdom'
	],
	function(slimdom) {
		'use strict';

		describe('Text', function() {
			var document,
				text;
			beforeEach(function() {
				document = slimdom.createDocument();
				text = document.createTextNode('text');
			});

			it('has nodeType 3', function() {
				expect(text.nodeType).toBe(3);
			});

			it('has data', function() {
				// TODO: data property not yet supported
				//expect(text.data).toBe('text');
				expect(text.nodeValue).toBe('text');
			});

			it('has a length', function() {
				expect(text.length()).toBe(4);
			});

			// TODO: wholeText not yet supported
			//it('has wholeText', function() {
			//	expect(text.wholeText).toBe('text');
			//})

			it('can be cloned', function() {
				var clone = text.cloneNode(true);
				expect(clone.nodeType).toBe(3);
				// TODO: data property not yet supported
				//expect(clone.data).toBe('text');
				expect(clone.nodeValue).toBe('text');
				expect(clone).not.toBe(text);
			});

			it('can substring its data', function() {
				expect(text.substringData(0, 2)).toBe('te');
				expect(text.substringData(2, 2)).toBe('xt');
				expect(text.substringData(1, 2)).toBe('ex');
				expect(text.substringData(2)).toBe('xt');
			});

			it('can appendData', function() {
				text.appendData('123');
				// TODO: data property not yet supported
				//expect(text.data).toBe('text123');
				expect(text.nodeValue).toBe('text123');
				expect(text.length()).toBe(7);
			});

			it('can insertData', function() {
				text.insertData(2, '123');
				// TODO: data property not yet supported
				//expect(text.data).toBe('te123xt');
				expect(text.nodeValue).toBe('te123xt');
				expect(text.length()).toBe(7);

				text.insertData(-100, '123');
				// TODO: data property not yet supported
				//expect(text.data).toBe('123te123xt');
				expect(text.nodeValue).toBe('123te123xt');
				expect(text.length()).toBe(10);

				text.insertData(100, '123');
				// TODO: data property not yet supported
				//expect(text.data).toBe('123te123xt123');
				expect(text.nodeValue).toBe('123te123xt123');
				expect(text.length()).toBe(13);
			});

			it('can deleteData', function() {
				text.deleteData(0, 0);
				// TODO: data property not yet supported
				//expect(text.data).toBe('text');
				expect(text.nodeValue).toBe('text');
				expect(text.length()).toBe(4);

				text.deleteData(-100, 1);
				// TODO: data property not yet supported
				//expect(text.data).toBe('text');
				expect(text.nodeValue).toBe('text');
				expect(text.length()).toBe(4);

				text.deleteData(100, 2);
				// TODO: data property not yet supported
				//expect(text.data).toBe('text');
				expect(text.nodeValue).toBe('text');
				expect(text.length()).toBe(4);

				text.deleteData(1, 1);
				// TODO: data property not yet supported
				//expect(text.data).toBe('txt');
				expect(text.nodeValue).toBe('txt');
				expect(text.length()).toBe(3);

				text.deleteData(2);
				// TODO: data property not yet supported
				//expect(text.data).toBe('tx');
				expect(text.nodeValue).toBe('tx');
				expect(text.length()).toBe(2);
			});

			it('can replaceData', function() {
				text.replaceData(0, 0, '');
				// TODO: data property not yet supported
				//expect(text.data).toBe('text');
				expect(text.nodeValue).toBe('text');
				expect(text.length()).toBe(4);

				text.replaceData(-100, 10, 'asd');
				// TODO: data property not yet supported
				//expect(text.data).toBe('asdtext');
				expect(text.nodeValue).toBe('asdtext');
				expect(text.length()).toBe(7);

				text.replaceData(100, 10, 'asd');
				// TODO: data property not yet supported
				//expect(text.data).toBe('asdtextasd');
				expect(text.nodeValue).toBe('asdtextasd');
				expect(text.length()).toBe(10);

				text.replaceData(3, 4, 'asd');
				// TODO: data property not yet supported
				//expect(text.data).toBe('asdasdasd');
				expect(text.nodeValue).toBe('asdasdasd');
				expect(text.length()).toBe(9);
			});

			describe('splitting', function() {
				it('can be split', function() {
					var otherHalf = text.splitText(2);
					// TODO: data property not yet supported
					//expect(text.data).toBe('te');
					//expect(otherHalf.data).toBe('xt');
					expect(text.nodeValue).toBe('te');
					expect(otherHalf.nodeValue).toBe('xt');
				});
				
				describe('under a parent', function() {
					var element,
						otherHalf;
					beforeEach(function() {
						element = document.createElement('parent');
						element.appendChild(text);
						otherHalf = text.splitText(2);
					});

					it('is split correctly', function() {
						// TODO: data property not yet supported
						//expect(text.data).toBe('te');
						//expect(otherHalf.data).toBe('xt');
						expect(text.nodeValue).toBe('te');
						expect(otherHalf.nodeValue).toBe('xt');
					});

					it('both halves are children of the parent', function() {
						expect(text.parentNode).toBe(element);
						expect(otherHalf.parentNode).toBe(element);
					});

					it('both halves are siblings', function() {
						expect(text.nextSibling).toBe(otherHalf);
						expect(otherHalf.previousSibling).toBe(text);
					});

					// TODO: wholeText not yet supported
					//it('has wholeText', function() {
					//	expect(text.wholeText).toBe('text');
					//	expect(otherHalf.wholeText).toBe('text');
					//});
				});
			});
		});
	}
);