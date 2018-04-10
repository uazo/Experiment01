export class ImmutableObj<T> {
	private obj: T;
	private immutable: Immutable<T, any>;

	constructor(obj: T) {
		this.obj = obj;
		this.immutable = new Immutable(obj, this);
	}

	public into<S>(callback: (a: T) => S | Function): Immutable<S, T> {
		return this.immutable.into(callback);
	}

	public foreach<S>(callback: (a: T) => Array<S> | Function): immutableArray<S, T> {
		var result = this.immutable.into(callback);

		var immutable = new immutableArray(result, this);
		return immutable;
	}

	set(obj: T) {
		this.obj = obj;
  }

  toObject(): T {
    return this.obj;
  }
}

class immutableArray<T, C> {
	private intoCallback: (a: T) => void;
	private refOfArray: Immutable<T[], C>;
	private parent: ImmutableObj<C>;

	constructor(refOfArray: Immutable<T[],C>, parent?: ImmutableObj<C>) {
		this.refOfArray = refOfArray;
		this.parent = parent;
	}

	public capture(callback: (a: T) => void): immutableArray<T, C> {
		this.intoCallback = callback;
		return this;
	}

	public first(where: (o: T) => boolean): Immutable<T, C> {
		var array = this.refOfArray.get();

		//var array = this.obj[elements.containerName];
		for (var elementKey in array) {
			var element = array[elementKey];
			if (where(element) == true) {
				var describe2: Immutable<T, C> = new Immutable<T, C>(element, this.parent, this.refOfArray, elementKey );
				return describe2;
			}
		}
		return null;
	}

	public into<S>(clause: (o: T) => S): ArrayOfImmutable<T, C, S> {
		var array = this.refOfArray.get();

		var result: ArrayOfImmutable<T, C, S>;
		result = new ArrayOfImmutable(this, this.parent);

		for (var elementKey in array) {
			var element = array[elementKey];

			var describe2: Immutable<T, C> = new Immutable<T, C>(element, this.parent, this.refOfArray, elementKey);
			result.push(describe2.into(clause));
		}
		return result;
	}

	public each<S>(clause: (o: T) => Array<S>): ArrayOfImmutable<T, C, S> {
		var array = this.refOfArray.get();

		var result: ArrayOfImmutable<T, C, S>;
		result = new ArrayOfImmutable(this, this.parent);

		for (var elementKey in array) {
			var element = array[elementKey];

			var describe2: Immutable<T, C> = new Immutable<T, C>(element, this.parent, this.refOfArray, elementKey);
			if (this.intoCallback != null) describe2 = describe2.capture(this.intoCallback);

			var describe2a = describe2.into(clause);
			var nested: S[] = describe2a.get();

			if (nested != null) {
				for (var nestedElementKey in nested) {
					var nestedElement = nested[nestedElementKey];
					var describe3: Immutable<S, C> = new Immutable<S, C>(nestedElement, this.parent, describe2a, nestedElementKey);
					result.push(describe3);
				}
			}
		}
		return result;
	}
}

class ArrayOfImmutable<T, C, S>
{
	private array: immutableArray<T, C>;
	private items: Immutable<S, C>[];
	private parent: ImmutableObj<C>;

	constructor(array: immutableArray<T, C>, parent: ImmutableObj<C> ) {
		this.array = array;
		this.items = [];
		this.parent = parent;
	}

	push(item: Immutable<S, C>) : void {
		this.items.push(item);
	}

	public first(where: (o: S) => boolean): Immutable<S, C> {
		for (var elementKey in this.items) {
			var element = this.items[elementKey];
			var obj = element.get();

			if (where(obj) == true) {
				return element;
			}
		}
	}

	public set(value: S): ArrayOfImmutable<T, C, S> {
		for (var element of this.items) 
		{
			element.set(value).apply();
		}
		return this;
	}

	public apply(): ImmutableObj<C> {
		return this.parent;
	}
}

class Immutable<T, C> {
	private _parent: ImmutableObj<C>;

	private container: Immutable<any, any> = null;
	private containerName: string;
	private containerKey: string;
	private intoCallback: (a: T) => void = null;
	private changed: boolean = false;
	private value: T;

	private obj: T;
	
	constructor(obj: T, parent?: ImmutableObj<C>, container?: Immutable<any, any>, containerKey?: string ) {
		this.obj = obj;
		this._parent = parent;

		if (container != null) {
			this.container = container;
			this.containerName = container.containerName;
		}
		this.containerKey = containerKey;
	}

	public into<S>(callback: (a: T) => S | Function): Immutable<S, C> {
		let describe: T = <T>{};

    var context = this;
		if (this.obj instanceof Object) {
			var proxy: T = new Proxy(describe as any, {
				get: function (target, name) {
					describe[name] = context.getterFunction.bind({
						name: name
					});
					return describe[name];
				}
			});

			var v: Function = callback(proxy) as Function;
			var inScope = v().name;

			var describe2: Immutable<S, C> = new Immutable<S, C>(this.obj[inScope]);
			describe2.container = this;
			describe2.containerName = inScope;

			return describe2;
		}
	}

	private getterFunction(): any {
		return this;
	}

	public set(value: T): Immutable<T, C> {
		if (this.container.obj[this.containerName] !== value) {
			this.changed = true;
			this.value = value;
		}
		return this;
	}
	public get(): T {
		return this.obj;
	}

	public capture(callback: (a: T) => void): Immutable<T, C> {
		var intoImmutable: Immutable<T, C> = new Immutable<T, C>(this.obj);
		intoImmutable.container = this.container;
		intoImmutable.containerName = this.containerName;
		intoImmutable.containerKey = this.containerKey;
		intoImmutable.intoCallback = callback;
		return intoImmutable;
	}

	public apply(): ImmutableObj<C> {
		this.reduce();

		var result = this.container;
		while (result.container != null) result = result.container;
		return result._parent;
	}

	//public toObject(): C {
	//	this._reduce();

	//	var result = this.container;
	//	while (result.container != null) result = result.container;
	//	return result.obj;
	//}

	private reduce(forceChanged: boolean = false, reducedValue?: any) {
		if ((forceChanged || this.changed)) {

			if (this.container == null)
			{
				this._parent.set(this.value === undefined ? reducedValue : this.value);
			}
			else if (this.container != null) {
				if (this.containerKey != null && this.container != null) {
					var array = this.container.obj.slice(0);
					array[this.containerKey] = this.value === undefined ? reducedValue : this.value

					this.container.obj = array;
				}
				else {
					this.container.obj = {
						...this.container.obj,
						[this.containerName]: this.value === undefined ? reducedValue : this.value
					};
				}

				this.container.reduce(forceChanged || this.changed, this.container.obj);
			}
		}

		if (this.intoCallback != null) {
			if (this.containerKey != null) {
				this.intoCallback(this.container.container.obj[this.containerName][this.containerKey]);
			}
			else {
				this.intoCallback(this.container.container.obj[this.containerName]);
			}
		}
	}
}