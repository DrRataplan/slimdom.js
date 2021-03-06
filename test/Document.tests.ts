import * as slimdom from '../src/index';

describe('Document', () => {
	let document: slimdom.Document;
	beforeEach(() => {
		document = new slimdom.Document();
	});

	it('can be created using its constructor', () => {
		const document = new slimdom.Document();
		expect(document.nodeType).toBe(9);
		expect(document.nodeName).toBe('#document');
		expect(document.nodeValue).toBe(null);
	});

	it('can not change its nodeValue', () => {
		document.nodeValue = 'test';
		expect(document.nodeValue).toBe(null);
	});

	it('exposes its DOMImplementation', () =>
		expect(document.implementation).toBeInstanceOf(slimdom.DOMImplementation));

	it('has a doctype property that reflects the presence of a doctype child', () => {
		expect(document.doctype).toBe(null);
		const doctype = document.implementation.createDocumentType('html', '', '');
		document.appendChild(doctype);
		expect(document.doctype).toBe(doctype);
		document.removeChild(doctype);
		expect(document.doctype).toBe(null);
	});

	it('initially has no documentElement', () => expect(document.documentElement).toBe(null));

	it('initially has no childNodes', () => expect(document.childNodes).toEqual([]));

	it('initially has no children', () => expect(document.children).toEqual([]));

	describe('after appending a child element', () => {
		let element: slimdom.Element;
		beforeEach(() => {
			element = document.createElement('test');
			document.appendChild(element);
		});

		it('has a documentElement', () => expect(document.documentElement).toBe(element));

		it('has childNodes', () => expect(document.childNodes).toEqual([element]));

		it('has children', () => expect(document.children).toEqual([element]));

		it('has a first and last element child', () => {
			expect(document.firstElementChild).toBe(element);
			expect(document.lastElementChild).toBe(element);
		});

		it('the child element is adopted into the document', () =>
			expect(element.ownerDocument).toBe(document));

		describe('after removing the element', () => {
			beforeEach(() => {
				document.removeChild(element);
			});

			it('has no documentElement', () => expect(document.documentElement).toBe(null));

			it('has no childNodes', () => expect(document.childNodes).toEqual([]));

			it('has no children', () => expect(document.children).toEqual([]));
		});

		describe('after replacing the element', () => {
			let otherElement: slimdom.Element;
			beforeEach(() => {
				otherElement = document.createElement('other');
				document.replaceChild(otherElement, element);
			});

			it('has the other element as documentElement', () =>
				expect(document.documentElement).toBe(otherElement));

			it('has childNodes', () => expect(document.childNodes).toEqual([otherElement]));

			it('has children', () => expect(document.children).toEqual([otherElement]));
		});
	});

	describe('after appending a processing instruction', () => {
		var processingInstruction: slimdom.ProcessingInstruction;
		beforeEach(() => {
			processingInstruction = document.createProcessingInstruction('sometarget', 'somedata');
			document.appendChild(processingInstruction);
		});

		it('has no documentElement', () => expect(document.documentElement).toBe(null));

		it('has childNodes', () => expect(document.childNodes).toEqual([processingInstruction]));

		it('has no children', () => expect(document.children).toEqual([]));

		describe('after replacing with an element', () => {
			let otherElement: slimdom.Element;
			beforeEach(() => {
				otherElement = document.createElement('other');
				document.replaceChild(otherElement, processingInstruction);
			});

			it('has the other element as documentElement', () =>
				expect(document.documentElement).toBe(otherElement));

			it('has childNodes', () => expect(document.childNodes).toEqual([otherElement]));

			it('has children', () => expect(document.children).toEqual([otherElement]));
		});
	});

	describe('.cloneNode', () => {
		beforeEach(() => {
			document.appendChild(document.createElement('root'));
		});

		it('can be cloned (shallow)', () => {
			const copy = document.cloneNode() as slimdom.Document;

			expect(copy.nodeType).toBe(9);
			expect(copy.nodeName).toBe('#document');
			expect(copy.nodeValue).toBe(null);

			expect(copy.documentElement).toBe(null);

			expect(copy).not.toBe(document);
		});

		it('can be cloned (deep)', () => {
			const copy = document.cloneNode(true) as slimdom.Document;

			expect(copy.nodeType).toBe(9);
			expect(copy.nodeName).toBe('#document');
			expect(copy.nodeValue).toBe(null);

			expect(copy.documentElement!.nodeName).toBe('root');

			expect(copy).not.toBe(document);
			expect(copy.documentElement).not.toBe(document.documentElement);
		});
	});

	it('can lookup a prefix or namespace on its document element', () => {
		expect(document.lookupNamespaceURI('prf')).toBe(null);
		expect(document.lookupPrefix('http://www.example.com/ns')).toBe(null);

		const element = document.createElementNS('http://www.example.com/ns', 'prf:test');
		document.appendChild(element);
		expect(document.lookupNamespaceURI('prf')).toBe('http://www.example.com/ns');
		expect(document.lookupPrefix('http://www.example.com/ns')).toBe('prf');
	});

	describe('.createElement', () => {
		it('throws if not given a name', () => {
			expect(() => (document as any).createElement()).toThrow(TypeError);
		});

		it('throws if given an invalid name', () => {
			expect(() => document.createElement(String.fromCodePoint(0x200b))).toThrow(
				'InvalidCharacterError'
			);
		});
	});

	describe('.createElementNS', () => {
		it('throws if given an invalid name', () => {
			expect(() => document.createElementNS(null, String.fromCodePoint(0x200b))).toThrow(
				'InvalidCharacterError'
			);
			expect(() => document.createElementNS(null, 'a:b:c')).toThrow('InvalidCharacterError');
		});

		it('throws if given a prefixed name without a namespace', () => {
			expect(() => document.createElementNS('', 'prf:test')).toThrow('NamespaceError');
		});

		it('throws if given an invalid use of a reserved prefix', () => {
			expect(() => document.createElementNS('not the xml namespace', 'xml:test')).toThrow(
				'NamespaceError'
			);
			expect(() => document.createElementNS('not the xmlns namespace', 'xmlns:test')).toThrow(
				'NamespaceError'
			);
			expect(() =>
				document.createElementNS('http://www.w3.org/2000/xmlns/', 'pre:test')
			).toThrow('NamespaceError');
		});
	});

	describe('.createCDATASection', () => {
		it('throws if data contains "]]>"', () => {
			expect(() => document.createCDATASection('meep]]>maap')).toThrow(
				'InvalidCharacterError'
			);
		});
	});

	describe('.createProcessingInstruction', () => {
		it('throws if given an invalid target', () => {
			expect(() =>
				document.createProcessingInstruction(String.fromCodePoint(0x200b), 'some data')
			).toThrow('InvalidCharacterError');
		});

		it('throws if data contains "?>"', () => {
			expect(() => document.createProcessingInstruction('target', 'some ?> data')).toThrow(
				'InvalidCharacterError'
			);
		});
	});

	describe('.importNode', () => {
		let otherDocument: slimdom.Document;
		beforeEach(() => {
			otherDocument = new slimdom.Document();
		});

		it('returns a clone with the document as node document', () => {
			const element = otherDocument.createElement('test');
			expect(element.ownerDocument).toBe(otherDocument);
			const copy = document.importNode(element);
			expect(copy.ownerDocument).toBe(document);
			expect(copy.nodeName).toBe(element.nodeName);
			expect(copy).not.toBe(element);
			expect(copy.childNodes).toEqual([]);
		});

		it('can clone descendants', () => {
			const element = otherDocument.createElement('test');
			element
				.appendChild(otherDocument.createElement('child'))
				.appendChild(otherDocument.createTextNode('content'));
			expect(element.ownerDocument).toBe(otherDocument);
			const copy = document.importNode(element, true) as slimdom.Element;
			expect(copy.ownerDocument).toBe(document);
			expect(copy.nodeName).toBe(element.nodeName);
			expect(copy).not.toBe(element);

			const child = copy.firstElementChild!;
			expect(child.nodeName).toBe('child');
			expect(child.ownerDocument).toBe(document);
			expect(child).not.toBe(element.firstElementChild);

			expect(child.firstChild!.ownerDocument).toBe(document);
			expect((child.firstChild as slimdom.Text).data).toBe('content');
		});

		it('throws if given a document node', () => {
			expect(() => document.importNode(otherDocument, true)).toThrow('NotSupportedError');
		});

		it('throws if given something other than a node', () => {
			expect(() => (document as any).importNode('not a node')).toThrow(TypeError);
		});
	});

	describe('.adoptNode', () => {
		let otherDocument: slimdom.Document;
		beforeEach(() => {
			otherDocument = new slimdom.Document();
		});

		it('modifies the node to set the document as its node document', () => {
			const element = otherDocument.createElement('test');
			expect(element.ownerDocument).toBe(otherDocument);
			const adopted = document.adoptNode(element);
			expect(adopted.ownerDocument).toBe(document);
			expect(adopted.nodeName).toBe(element.nodeName);
			expect(adopted).toBe(element);
		});

		it('also adopts descendants and attributes', () => {
			const element = otherDocument.createElement('test');
			element
				.appendChild(otherDocument.createElement('child'))
				.appendChild(otherDocument.createTextNode('content'));
			element.setAttribute('test', 'value');
			expect(element.ownerDocument).toBe(otherDocument);
			const adopted = document.adoptNode(element) as slimdom.Element;
			expect(adopted.ownerDocument).toBe(document);
			expect(adopted.nodeName).toBe(element.nodeName);
			expect(adopted).toBe(element);

			const child = adopted.firstElementChild!;
			expect(child.ownerDocument).toBe(document);
			expect(child.firstChild!.ownerDocument).toBe(document);

			const attr = adopted.getAttributeNode('test');
			expect(attr!.ownerDocument).toBe(document);
		});

		it('throws if given a document node', () => {
			expect(() => document.adoptNode(otherDocument)).toThrow('NotSupportedError');
		});
	});

	describe('.createAttribute', () => {
		it('throws if given an invalid name', () => {
			expect(() => document.createAttribute(String.fromCodePoint(0x200b))).toThrow(
				'InvalidCharacterError'
			);
		});
	});
});
