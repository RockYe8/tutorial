# 06. Python 为什么让 `class` 产生新的类型对象，再由类型对象产生实例？

## 本章推理总览

前五章已经说明 Python 如何把运行中的值、名字、容器、函数和模块组织成对象模型。这个模型可以用 `dict` 表示一项测量，也可以用自由函数处理这项测量，但此时“测量”只存在于调用者约定中：对象的运行时类型，也就是 `type(对象)` 返回的类型对象，仍然是 `dict`；运行时不会因为字典里有 `"name"`、`"value"` 和 `"unit"` 这些键，就得到一个名为 `Measurement` 的新对象种类。由此产生的缺口是：程序需要表达一批同类实体，让它们共享同一套定义和操作，同时让每个具体实体保存自己的状态。[Python Data Model: Objects, values and types][python-objects-types]

Python 对这个缺口的回答不是在 `dict` 上附加业务标签，而是允许程序创建新的类型对象。内置的 `list`、`dict`、`tuple` 和 `set` 是运行时预先提供的类型对象；`class Measurement: ...` 则让当前程序在运行时产生自己的类型对象。类对象和类型对象不是两件东西：说 `Measurement` 是类对象，是强调它由类定义语句产生并能创建实例；说它是类型对象，是强调 `type(measurement) is Measurement` 时，它作为实例的运行时类型存在。[Python Data Model: Custom classes][python-custom-classes]

要产生这样的类型对象，`class` 必须是一条会执行的语句。解释器运行到 `class Measurement: ...` 时，先为类体准备类命名空间；类体中的赋值把名字绑定到对象，类体中的 `def` 创建函数对象并把方法名绑定到这个函数对象。类体执行完成后，Python 才用类名、基类和类命名空间创建类对象，并把外围命名空间中的名字 `Measurement` 绑定到这个类对象；类命名空间中收集到的绑定则成为类对象属性命名空间中的内容。基类解决“类创建完成后从哪里继承和查找已有定义”；元类是类对象的运行时类型，解决“类对象创建时由谁制造并规定创建规则”。实例对象也有运行时类型，但不把实例的运行时类型称为元类。[Python Language Reference: Class definitions][python-class-definitions][Python Execution Model: Class definition blocks][python-class-blocks]

类对象创建完成后，才能由它创建实例。调用 `Measurement(...)` 通常先进入创建阶段：产生一个有独立 identity、运行时类型指向 `Measurement` 的新实例对象；随后进入初始化阶段：把这个新实例作为 `self` 传给 `__init__`，由 `__init__` 把 `name`、`value` 等具体状态写入这个实例。这个顺序把“共同定义在哪里”和“具体状态在哪里”分开：共同定义属于类对象，具体状态属于每个实例对象。[Python Data Model: Basic customization][python-basic-customization]

类对象和实例对象之间通过属性存储与属性查找连接。普通实例把自己的状态保存在实例属性中；类对象把共同属性和函数对象保存在类的属性命名空间中。读取 `measurement.unit` 时，如果实例自身没有同名属性，点号查找会经由 `type(measurement)` 到达 `Measurement`，再沿类对象记录的继承顺序继续查找。实例同名赋值会遮蔽类属性；直接修改类属性会影响没有同名实例属性的实例；类属性若绑定可变对象，多个实例可能观察到同一个被修改的对象。完整属性查找、描述器、属性访问钩子、`__slots__` 和继承细节在后续章节展开，本章只建立普通路径及其边界。

类体中的函数对象也通过这条查找路径参与实例行为。函数对象保存在类对象上，不会复制进每个实例；当用户定义函数经实例访问时，Python 形成绑定方法对象，把原函数和当前实例保存到同一个可调用对象里。调用 `measurement.scaled(2)` 时，执行的仍是类对象上的同一个函数体，只是当前实例会作为第一个实参传给显式形参 `self`；因此 `measurement.scaled(2)` 与 `Measurement.scaled(measurement, 2)` 在核心调用关系上相通。[Python Data Model: Instance methods][python-instance-methods][Python Tutorial: Method objects][python-method-objects][Python Design FAQ: Explicit self][python-explicit-self]

类边界带来的组织能力也带来状态代价。属于对象持续身份或长期约束的状态适合进入实例属性；只属于一次计算过程的数据更适合作为局部变量、参数或返回值。若把临时数据长期保存为实例属性，方法调用就可能依赖调用表面看不见的历史状态。Java、C++ 和 Python 都处理同类实体共享行为与各自保存状态的问题：Java 更早把约束交给静态类型和 JVM，C++ 把存储、生命周期和布局放在中心，Python 则把类定义、类对象、实例、属性查找和绑定方法放进运行时对象模型。[Java Language Specification: Classes][jls-classes][C++ Draft: Classes][cpp-classes][C++ Draft: Objects and storage][cpp-objects]

## 本章证据底座

本章的语言事实主要来自 Python Data Model、Python Tutorial 的 Classes 章节、Language Reference 的 class definition 规则，以及 Execution Model 对 class definition block 的说明。对象的 identity、type、value，用户定义类、实例、方法对象、`__new__`、`__init__`、属性访问和类定义执行边界，都以这些官方文档为事实边界。[Python Data Model: Objects, values and types][python-objects-types][Python Data Model: Custom classes][python-custom-classes][Python Tutorial: Classes][python-classes][Python Language Reference: Class definitions][python-class-definitions]

本章还少量连接 CPython 实现事实，用来说明“类型对象也是对象”和“绑定方法对象保存 function 与 self”并非抽象比喻。CPython 的对象模型以对象引用、类型对象和 C 层对象结构承载这些语言层关系；`PyType_Type` 的自指关系解释了 `type(type) is type` 在实现中如何闭合。[CPython C API: Objects, Types and Reference Counts][python-c-api-intro][CPython C API: Method objects][python-c-api-method][CPython source: `PyType_Type`][cpython-pytype-type]

Java 与 C++ 的比较只用于定位约束位置。Java 把类、字段、方法和构造更多放在静态类型与 JVM 约束中；C++ 把类类型、对象存储、生命周期和布局作为中心约束；Python 则把类定义、类对象、实例对象和方法绑定放进运行时对象模型。[Java Language Specification: Classes][jls-classes][C++ Draft: Classes][cpp-classes][C++ Draft: Objects and storage][cpp-objects]

## 从已有对象到新的类型对象

前五章已经建立了 Python 运行时的基本单位：表达式执行后产生对象，名字绑定对象，对象有身份、运行时类型和值，容器保存对象引用，函数把一段可调用行为包装成函数对象，模块为一组顶层名字建立文件边界。这个模型已经能解释列表、字典、函数和模块怎样存在。接下来的压力来自另一类程序结构：同一种业务实体会反复出现，每个实体有自己的状态，但它们又共享同一组操作。

一项测量可以先用字典表示：

```python
measurement_dict = {
    "name": "latency",
    "value": 12.5,
    "unit": "ms",
}
```

这个写法已经把三项数据组织在同一个对象里，却没有让 Python 运行时获得一种新的对象种类。运行时看到的仍然是一个字典实例；`"name"`、`"value"` 和 `"unit"` 是这个字典内部用于查找值的键，不是这个对象的运行时类型。换言之，字典路线能表达“这个 `dict` 里面按约定放了测量数据”，但不能让程序得到一个可以创建测量实例、保存共同定义、参与属性查找和方法绑定的 `Measurement` 类型对象。

> 定义  
> 运行时类型是对象在程序执行期间持有的类型关系。对对象求 `type(obj)` 会返回它的类型对象；说“某对象的运行时类型是 `list`”，精确含义是 `type(该对象) is list` 成立。

> 定义  
> 类型对象不是口语中的分类名称，而是 Python 对象模型中的运行时对象。它作为某些对象的 `type(...)` 结果存在，决定这些对象支持哪些操作，并参与属性查找、实例创建和后续类型关系判断。

`class` 引入的新能力就在这里：程序可以自己创建新的类型对象。内置的 `list`、`dict`、`tuple` 和 `set` 是 Python 运行时预先提供的类型对象；用户定义的 `Measurement` 则是程序执行类定义语句后产生的类型对象。二者的共同点是都能创建实例，差别是来源不同、支持的操作和共同定义不同。

为了验证“字典没有变成新类型对象”，需要观察对象的运行时类型。Python 提供的直接观察方式是内置函数 `type`。

`type(obj)` 是一次函数调用：括号里的 `obj` 是参数表达式，解释器先求值这个表达式，得到某个对象，再把这个对象作为实参传给内置函数 `type`。这里解释调用过程，是为了精确说明后面的 `type(measurement_dict) is dict` 检查的是“对象的运行时类型关系”，不是检查字典内容里有没有某些业务字段。

> 定义  
> 表达式是能够被执行并产生结果对象的代码片段，名字、字面量、函数调用、属性访问和对象创建都可以是表达式；实参是函数调用时实际传入的对象。在 `items = []` 中，`[]` 是产生列表对象的表达式，`items` 是绑定目标，不是传给某个函数的实参。

`type(obj)` 的调用结果就是 `obj` 这个对象的类型对象。

列表对象的运行时类型是 `list`，字典对象的运行时类型是 `dict`：

```python
type([]) is list
type({}) is dict
type(()) is tuple
type(set()) is set
```

这些表达式右侧的 `list`、`dict`、`tuple` 和 `set` 也都是对象。它们是 Python 运行时预先提供的类对象，同时也是类型对象：`list` 用来创建 `list` 实例，`dict` 用来创建 `dict` 实例。

> 定义  
> 类对象和类型对象不是两个分离对象。说 `list` 是类对象，是强调它能创建 `list` 实例；说 `list` 是类型对象，是强调 `type([]) is list`，也就是它作为列表实例的运行时类型。同一个对象可以同时承担这两个角色。

> 定义  
> 实例对象是由某个类型对象创建出来、并把这个类型对象作为自身运行时类型的对象。`[]` 是 `list` 的实例对象，`{}` 是 `dict` 的实例对象；后文的 `Measurement("latency", 12.5)` 会创建 `Measurement` 的实例对象。

对象的 type 字段所指向的就是这样的类型对象；说“这是 list 对象”，精确含义是这个对象的运行时类型为 `list`。

测量字典也服从同一条规则：

```python
type(measurement_dict) is dict
```

无论这个字典是否包含 `"name"`、`"value"` 和 `"unit"`，Python 运行时看到的类型对象仍然是 `dict`。这些键可以让程序按约定读取测量名称、数值和单位，但它们不会让运行时得到一个名为 `Measurement` 的新类型对象，也不会自动规定缩放、单位换算和数值校验是这个对象自身可获得的行为。

类型对象本身也有运行时类型：

```python
type(list) is type
type(type) is type
```

`type(type) is type` 并不是 Python 代码递归定义出来的结果。在 CPython 中，核心类型对象由 C 层静态结构建立，`PyType_Type` 的类型字段指向自身，从实现层闭合了“类型对象也是对象”的关系。[CPython source: `PyType_Type`][cpython-pytype-type] 本章只用这个事实校准对象模型：类对象也是对象，类型对象也要服从对象模型；自定义元类协议留到第 10 章展开。

> 解释  
> 这段实现细节只服务一个判断：Python 没有把“类型”放在对象模型之外。类型对象也以对象身份存在，后面 `Measurement` 才能同时被名字绑定、被调用、作为实例的运行时类型，并继续拥有自己的运行时类型。

## 字典和自由函数能表示数据，但边界依靠约定

字典路线并非错误。字典的优势是数据形状直接可见：`"name"`、`"value"` 和 `"unit"` 是字典键，键是映射对象中用于查找值的对象；`measurement_dict["unit"]` 会用键 `"unit"` 找到对应的值 `"ms"`。当数据只是跨边界传递的记录时，字典可以非常合适。

自由函数可以处理这种字典：

```python
def scale_measurement(measurement, factor):
    return {
        "name": measurement["name"],
        "value": measurement["value"] * factor,
        "unit": measurement["unit"],
    }
```

这条路线的优点是数据流清楚。函数调用时，形参 `measurement` 绑定到传入的字典对象，形参 `factor` 绑定到缩放倍数；返回值也是显式产生的新字典。代价是“哪些键共同构成一项有效测量”“哪些函数按这种形状读取字典”“数值和单位要满足什么约束”主要依赖调用者和函数作者之间的约定。Python 运行时只知道这个对象是 `dict`，不知道它是一个具有稳定操作集合的测量对象。

`class` 接住的正是这个边界：程序不只能使用内置类型对象，还能执行类定义语句，创建新的用户定义类型对象。这样，“测量”不再只是某个字典内部的键值约定，而能成为 Python 对象模型中的一种类型关系。

> 解释  
> 字典路线把“测量”放在值的内部结构里：只要键和值满足约定，相关函数就能处理它。类路线把“测量”提升为运行时类型关系：对象不只携带若干键值，还能让 `type(obj) is Measurement` 成立，并让属性查找、方法绑定和后续类型匹配围绕这个类型对象运行。

## 执行 `class`：类定义语句先产生类对象

要让“测量”成为 Python 运行时里的新类型，程序不能只写下一组字段名称和函数名称；解释器必须在运行时形成一个真正的类对象。`class Measurement: ...` 因此是一条可执行语句。它不是在源码中静态摆放一个模板，而是在程序运行到这条语句时执行类体，并在执行结束后产生一个类对象。[Python Language Reference: Class definitions][python-class-definitions]

```python
class Measurement:
    unit = "ms"

    def __init__(self, name, value):
        self.name = name
        self.value = value

    def scaled(self, factor):
        return Measurement(self.name, self.value * factor)
```

类对象创建前，解释器需要先知道这个类对象要有哪些共同定义。为此，Python 会先为类体准备一个类命名空间。类命名空间是在类对象创建前暂存类体名字绑定的映射，不是已经创建完成的类对象。[Python Execution Model: Class definition blocks][python-class-blocks]

> 定义  
> 类命名空间是类体执行期间保存名字绑定的映射。它临时收集类体中的赋值、函数定义和其他绑定，随后作为创建类对象的输入。

类体中的赋值语句：

```python
unit = "ms"
```

会把类命名空间中的名字 `unit` 绑定到字符串对象 `"ms"`。

类体中的函数定义：

```python
def __init__(self, name, value):
    ...
```

会创建一个函数对象，并把类命名空间中的名字 `__init__` 绑定到这个函数对象。`scaled` 的定义同理：`def` 先创建函数对象，再把方法名绑定到这个函数对象。函数对象是可调用对象，保存函数体、参数和执行所需的函数信息；此时还没有任何实例对象参与。

当类体中的共同定义都进入类命名空间后，解释器才具备创建类对象所需的信息。Python 随后使用类名、基类和类命名空间创建类对象 `Measurement`，然后把外围命名空间中的名字 `Measurement` 绑定到这个类对象。

类对象创建完成后，类体执行期间的命名空间不再只是“临时收集绑定的地方”。其中的绑定内容会成为类对象属性命名空间的一部分，因此可以通过类对象继续访问：

```python
Measurement.unit
Measurement.__init__
Measurement.scaled
```

这个过程可以分成两个阶段理解：类体执行期间，类命名空间收集 `unit -> "ms"`、`__init__ -> 函数对象`、`scaled -> 函数对象` 这些绑定；类对象创建后，这些绑定成为 `Measurement` 这个类对象上的属性。绑定没有消失，只是从“类体执行时的命名空间”进入了“类对象自己的属性命名空间”。这一步也解释了为什么后面实例能够经由 `type(measurement)` 找到类对象上的 `unit` 和 `scaled`。

基类是创建当前类对象时记录的继承来源；没有显式写出基类的普通类默认以 `object` 为基类。`class TimedMeasurement(Measurement): ...` 则把 `Measurement` 作为 `TimedMeasurement` 的基类。

> 定义  
> 基类是创建当前类对象时记录的继承来源。它参与类对象的继承关系和后续属性查找；没有显式基类的普通类默认以 `object` 为基类。

类对象创建完成后会保存自己的基类关系。普通情况下可以通过 `Measurement.__bases__` 观察直接基类，通过 `Measurement.__mro__` 观察属性查找使用的继承顺序。`type(a)` 取得实例的类型对象后，属性查找不是凭空“知道”基类，而是沿这个类型对象记录的继承顺序继续查找。

基类和元类之所以分开，是因为类定义同时遇到两个不同问题。

第一个问题发生在类对象创建之后：新类怎样复用已有类的定义，实例属性查找找不到时应该继续到哪里找。基类解决这个问题。`class TimedMeasurement(Measurement): ...` 表示 `TimedMeasurement` 这个类创建完成后，要把 `Measurement` 放进自己的继承来源中；后续实例读取属性时，可以从 `TimedMeasurement` 继续查到 `Measurement`，再继续查到更上层的基类。

第二个问题发生在类对象创建本身：解释器已经有类名、基类和类命名空间，接下来由谁把这些材料变成一个类对象，这个类对象怎样响应调用、怎样准备属性查找所需的内部结构。元类解决这个问题。普通类默认由 `type` 这个元类创建，因此 `Measurement` 这个类对象本身的运行时类型是 `type`。

这两类责任不能合并到基类中。基类在逻辑上是“被新类继承的已有类”，它参与的是新类创建完成后的复用和查找；元类在逻辑上是“制造类对象的类型对象”，它参与的是新类对象如何被创建。若只保留基类关系，就能说明 `TimedMeasurement` 从 `Measurement` 继承什么，却不能说明 `Measurement` 这个类对象本身由什么机制产生。若只保留元类关系，就能说明类对象如何被制造，却不能说明实例查找属性时应当沿哪些父类继续寻找。

```python
Measurement.__bases__
# (<class 'object'>,)

type(Measurement) is type
# True
```

这两条关系不能互相替代。实例读取属性时，经由 `type(measurement)` 找到 `Measurement`，再沿 `Measurement.__mro__` 所记录的基类顺序查找实例可用的属性；而创建 `Measurement` 这个类对象时，默认由元类 `type` 执行类对象创建规则。前者回答“类创建完成后从哪里继承和查找”，后者回答“类对象创建时由谁制造和规定创建规则”。

元类不是所有对象的另一个平行分类层级；它是“类对象的运行时类型”这个关系的名称。普通实例对象也有运行时类型，例如 `type(measurement) is Measurement`，但通常不称 `Measurement` 为实例 `measurement` 的元类，而称它为这个实例的类对象或类型对象。类对象本身也是对象，因此类对象也有运行时类型；`type(Measurement) is type` 中的 `type` 才称为 `Measurement` 的元类。类对象还记录基类关系，例如 `Measurement.__bases__`，这条关系用于继承和属性查找。

```text
measurement 这个实例对象
  type -> Measurement

Measurement 这个类对象
  type -> type        # 元类关系
  bases -> object     # 基类关系
```

类对象也是类型对象。执行完上面的类定义后，`Measurement` 和 `list` 在对象模型中承担相同种类的角色：二者都可以作为其实例的运行时类型。

> 定义  
> 这里的“类对象”和“类型对象”指向同一个对象，只是观察角度不同。`Measurement` 由类定义语句创建，因此称为类对象；`type(m) is Measurement` 成立时，`Measurement` 又是 `m` 的类型对象。

区别在于来源和具体规则：`list` 是运行时内置提供的类对象，用来创建列表实例；`Measurement` 是当前程序定义的类对象，用来创建测量实例。

```python
type(Measurement) is type

m = Measurement("latency", 12.5)
type(m) is Measurement
```

类对象本身有身份、运行时类型和值；它的值包括名称、基类、属性命名空间等可观察状态。类对象的运行时类型称为元类。普通用户定义类默认由 `type` 创建，因此 `type(Measurement) is type`。元类决定类对象如何被创建、如何响应调用和某些类级操作；本章只保留默认元类 `type` 的普通路径，完整元类机制留到第 10 章。

> 定义  
> 元类是创建类对象的类型对象。普通用户定义类默认由 `type` 创建；本章只使用这一默认事实，不展开自定义元类如何改变类创建协议。

类定义语义还允许类装饰器。类装饰器是在类对象创建完成后、类名最终绑定前执行的可调用对象；它接收刚创建的类对象，并把返回对象作为类名的最终绑定结果。它可以修改并返回原类对象，也可以返回另一个对象。本章不依赖类装饰器，只用它说明类定义是一段运行时执行过程，而不是静态模板声明。

> 解释  
> 基类、元类、类命名空间和类装饰器都属于“类对象怎样被创建”的链条。本章需要它们来说明 `class` 是运行时执行过程；完整可定制创建协议不在本章展开。

## 调用类对象：创建先于初始化

类对象可以接受调用操作。普通用户定义类被调用时，通常产生这个类的新实例：

```python
measurement = Measurement("latency", 12.5)
```

> 定义  
> 可调用对象是能够出现在调用表达式中的对象，也就是能够写成 `对象(实参...)` 并触发调用行为的对象。函数对象、类对象和绑定方法对象都可以是可调用对象，但它们被调用时执行的具体规则不同。

这次调用包含两个责任不同的阶段。[Python Data Model: Basic customization][python-basic-customization]

第一阶段是创建。`__new__` 负责实际产生并返回尚未初始化完成的新实例。普通路径下，解释器会为新对象分配运行时对象所需的存储，初始化必要字段，使它获得独立身份，使它的运行时类型指向 `Measurement`，并准备实例自己的属性存储。这个结果已经是一个 Python 对象，但还没有写入测量名称和数值。

> 解释  
> 创建阶段回答“这个实例对象是否已经存在”。它负责取得一个具有身份和运行时类型的新对象，但不负责把业务状态写完整；业务状态由随后的初始化阶段处理。

第二阶段是初始化。若创建阶段返回的是合适的 `Measurement` 实例，Python 会调用类对象上定义的 `__init__` 函数对象，把新实例作为第一个实参传给它：

```python
def __init__(self, name, value):
    self.name = name
    self.value = value
```

这里的 `self` 不是关键字，也不是声明实例变量的特殊语法；它只是第一个形参的惯用名称。调用 `Measurement("latency", 12.5)` 时，`self` 绑定到刚创建出来的实例对象，`name` 绑定到字符串对象 `"latency"`，`value` 绑定到浮点数对象 `12.5`。语句 `self.name = name` 和 `self.value = value` 会在当前实例上建立或更新实例属性。

> 解释  
> 初始化阶段回答“这个已经存在的新实例如何变成可用状态”。`self` 让函数体明确知道正在写入哪一个实例；因此两个实例调用同一个 `__init__` 函数对象时，会把状态写入各自不同的实例。

初始化不是创建对象本身。因此 `__init__` 必须正常返回 `None`；显式返回其他对象会触发 `TypeError`。这条边界能解释一个常见误解：实例不是类对象的整体副本，实例状态也不是预先保存在类对象里再复制出来。类对象保存共同定义并参与创建；每次调用类对象通常产生一个有独立身份的新实例；初始化再把本次实例自己的状态绑定到这个实例上。

## 属性：实例状态、类共同定义和默认查找路径

属性是通过点号写法从对象取得或设置的命名成员，例如 `measurement.value`。点号写法是访问入口，不是属性本身的存储位置；当解释器执行 `measurement.value` 时，它需要回答的是：对象 `measurement` 上名为 `value` 的属性是否存在，如果存在，这个名字绑定到哪个对象。

> 定义  
> 属性是通过点号写法从对象取得或设置的命名成员。实例属性保存在具体实例上，类属性保存在类对象上；点号访问负责在这些位置之间查找或写入。

普通 Python 实例默认使用一个映射保存自己的属性绑定。这个映射把属性名映射到属性值对象，通常可以通过实例的 `__dict__` 观察：

```python
measurement = Measurement("latency", 12.5)
measurement.__dict__
# {'name': 'latency', 'value': 12.5}
```

> 解释  
> `measurement.value` 负责发起“读取 value 属性”的请求；`measurement.__dict__` 是普通实例默认保存自有属性绑定的地方。点号访问必须落到某种属性存储或查找规则上，否则对象无法在运行时记录任意多个动态增加的属性名和值。

`self.name = name` 与 `self.value = value` 建立的是实例属性。不同实例有不同身份，也有各自的实例属性存储：

```python
a = Measurement("latency", 12.5)
b = Measurement("throughput", 80)

a.name
# 'latency'

b.name
# 'throughput'
```

类体里的 `unit = "ms"` 则先属于类对象。它是 `Measurement` 的属性命名空间中的一个名字绑定，不会在每个实例创建时自动复制一份到实例属性存储中。实例之所以能读到它，是因为普通点号读取有默认查找路径：

```python
a.unit
# 'ms'
```

在不展开描述器等完整规则时，这条默认路径可以先表述为：读取实例属性时，解释器先考虑实例自己的属性存储；如果实例没有同名属性，再经由 `type(a)` 到达类对象 `Measurement`，并沿类对象记录的继承顺序查找属性。这里使用 `type(a)`，是为了用语言层可观察的方式表达“实例的运行时类型指向哪个类型对象”；具体实现会在对象结构中保存到类型对象的引用。设置普通属性时，解释器通常在当前实例自己的属性存储中建立或更新同名绑定。

> 解释  
> 这条默认路径解释了“共同默认值”和“各自状态”如何同时成立：类属性不被复制进每个实例，但实例可以通过类型关系找到它；实例一旦拥有同名属性，读取就优先落到自己的状态上。

> 定义  
> 遮蔽是指后出现或更优先位置上的同名绑定，使查找结果不再落到原来的绑定上。实例属性遮蔽类属性时，类对象上的绑定仍然存在，只是这一次点号读取先命中了实例自己的同名属性。

```python
a.unit = "s"

a.unit
# 's'

b.unit
# 'ms'

Measurement.unit
# 'ms'
```

`a.unit = "s"` 没有修改类对象上的 `Measurement.unit`。它在实例 `a` 自己的属性存储中建立了名为 `unit` 的绑定，使 `a.unit` 后续优先读到实例属性。实例 `b` 没有同名实例属性，所以仍然读到类对象上的共同默认值。

如果直接修改类对象属性：

```python
Measurement.unit = "second"

b.unit
# 'second'

a.unit
# 's'
```

所有没有用实例属性遮蔽 `unit` 的实例都会看到新的类属性绑定；已经拥有同名实例属性的 `a` 仍优先读取自己的 `unit`。

类属性绑定到可变对象时，还会出现共享可变状态：

```python
class Bucket:
    items = []

a = Bucket()
b = Bucket()

a.items.append("x")
b.items
# ['x']
```

`a.items.append("x")` 不是给 `a` 建立实例属性，而是先通过属性查找到类对象上的同一个列表对象，再修改这个列表对象的内容。`b.items` 也通过类属性找到同一个列表对象，所以会观察到变化。这个失败模式需要结合可变对象和别名关系完整解释，放在第 08 章展开；本章只建立必要结论：实例不会复制类属性绑定，类属性可以作为共同默认值被实例查到。

“普通类”这个限制也有明确含义。Python 允许类自定义属性机制，从而改变默认路径。自定义属性机制就是让读取、找不到属性时的处理、赋值和存储位置交给额外规则或对象处理，而不是只按“实例属性存储、类对象属性命名空间、基类顺序”取得或写入对象。`__getattribute__` 可以接管属性读取，`__getattr__` 可以处理默认路径找不到的属性，`__setattr__` 可以接管属性赋值。

描述器不是一种固定的运行时类型，而是一类对象在属性访问中承担的协议角色。一个对象只要由其类型提供 `__get__()`、`__set__()` 或 `__delete__()` 方法之一，就可以作为描述器参与点号访问。描述器通常放在类对象的属性命名空间中；当实例或类通过点号访问命中这个对象时，解释器可以调用它的访问方法，让它参与决定读取、赋值或删除的结果。本章在这里只建立这个边界：点号访问命中类对象上的属性后，不一定总是原样返回该属性对象。

> 定义  
> 描述器是实现描述器协议的对象，而不是名为 `descriptor` 的统一类型。本章只需要一种描述器事实：类体中由 `def` 创建的用户定义函数对象可以作为描述器；它经由实例访问时，会参与产生绑定方法对象。其他描述器用途属于完整属性模型，放到后续章节展开。

`__slots__` 是类定义中声明实例可用属性名并改变实例属性存储方式的机制；类声明 `__slots__ = ("name", "value")` 后，解释器可以为实例准备固定属性槽位，而不是为每个实例都提供普通可修改属性字典。普通 `__dict__` 的优势是允许运行时新增和删除属性，代价是每个实例需要维护可变映射；固定槽位减少了这种动态性，也限制了可设置的属性名。由此产生的实例只能设置声明过的属性名，给未声明属性赋值通常会触发 `AttributeError`；如果仍需要普通属性字典，可以把 `"__dict__"` 也声明进 `__slots__`。

> 解释  
> 这些机制放在这里不是为了提前展开完整属性模型，而是为了限定本章结论的范围。只要类接管读取、赋值或存储路径，`obj.x` 就不一定只是从实例字典或类命名空间取出原样绑定的对象；第 07 章会把完整查找顺序展开。

这些机制不是本章主线，但它们校准了一个重要说法：普通实例“通常”用 `__dict__` 保存属性，不等于所有 Python 对象都必然有一个可直接修改的 `__dict__`。完整属性查找顺序属于第 07 章。

## 方法绑定：类上的函数怎样成为实例的方法

类体里的 `def` 创建函数对象，并把函数对象绑定到类对象的属性命名空间：

```python
Measurement.scaled
```

从类对象上取得 `scaled`，通常得到的是原函数对象。调用它时，调用者必须显式传入实例：

```python
Measurement.scaled(measurement, 2)
```

通过实例访问同一个名字时，结果不同：

```python
method = measurement.scaled
```

这里正好用到前一节提到的描述器机制。类体中的 `def scaled(...)` 执行后，`Measurement.__dict__["scaled"]` 绑定到一个函数对象；这个函数对象的运行时类型是 `function`。函数体里没有写 `__get__`，`Measurement` 类体里也没有写 `__get__`；提供 `__get__` 行为的是函数对象的类型 `function`。因此，这个函数对象放在类对象属性命名空间中、又经由实例访问时，可以作为描述器参与这次点号访问。

```python
func = Measurement.__dict__["scaled"]
type(func).__name__
# 'function'
```

实例访问 `measurement.scaled` 时，Python 在 `Measurement` 上找到这个函数对象后，不只是原样返回它，而是通过函数对象的描述器行为创建绑定方法对象。绑定方法对象也是可调用对象，但它不是原函数对象本身。它保存两项核心关系：`__func__` 指向类对象上的原函数对象，`__self__` 指向本次访问使用的实例对象。[Python Data Model: Instance methods][python-instance-methods][CPython C API: Method objects][python-c-api-method]

> 定义  
> 绑定方法对象是实例访问类上的用户定义函数时产生的可调用对象。它把“要执行的原函数”和“本次作为接收者的实例”保存到一起。

```python
method.__func__ is Measurement.scaled
method.__self__ is measurement
```

取得绑定方法对象不会执行函数体。只有调用这个方法对象时，Python 才执行原函数体，并把保存的实例作为第一个实参传入：

```python
method(2)
```

等价于把 `measurement` 作为第一个参数交给原函数：

```python
Measurement.scaled(measurement, 2)
```

常见写法：

```python
measurement.scaled(2)
```

只是把两个阶段写在一个表达式中：先求值 `measurement.scaled` 得到绑定方法对象，再以 `2` 为显式实参调用它。[Python Tutorial: Method objects][python-method-objects]

> 解释  
> 绑定方法对象服务于一次具体访问：它把“类上保存的函数对象”和“本次访问使用的实例对象”合在一起。把 `measurement.scaled` 保存到变量中时，可以观察到这个方法对象；直接写 `measurement.scaled(2)` 时，访问和调用连在一起，语义上仍然先形成接收者绑定再执行函数体，具体解释器可以优化这个临时对象的创建成本。

这解释了为什么 `self` 必须写在方法定义中。Python 隐式提供实例，但函数体里仍然要有一个形参接住它：

```python
def scaled(self, factor):
    return Measurement(self.name, self.value * factor)
```

`self` 不是语法关键字，换成别的名字也能运行；但社区约定使用 `self`，因为它清楚表明这个参数绑定的是当前实例。Python 设计 FAQ 把显式 `self` 与 Python 没有变量声明的名字规则联系起来：如果省略 `self.`，解释器和读者都需要另一套规则区分局部名字和实例属性；显式接收者让 `Measurement.scaled(measurement, 2)` 这样的形式仍保持普通函数调用语义。[Python Design FAQ: Explicit self][python-explicit-self]

> 解释  
> `self` 把第 03 章的参数绑定带入类模型：方法仍然执行函数体，只是实例通过绑定方法或显式参数成为第一个实参。显式写 `self.value`，就是把“读写当前实例属性”同局部名字 `value` 区分开。

局部名字和实例属性因此必须区分：

```python
def change_local(self, value):
    value = value * 2

def change_instance(self, value):
    self.value = value * 2
```

第一段只重新绑定当前函数调用中的局部名字 `value`，不会修改实例属性。第二段通过 `self.value` 对当前实例设置属性，后续通过同一实例可以读到变化。

## 类边界带来组织能力，也带来状态代价

类适合表达一组共享行为围绕各自状态运行的实体。`Measurement("latency", 12.5)` 和 `Measurement("throughput", 80)` 是两个不同实例；它们共享 `Measurement` 上的函数定义和共同属性，却分别保存自己的 `name` 和 `value`。这种结构让操作可以围绕对象状态组织：

```python
latency = Measurement("latency", 12.5)
twice = latency.scaled(2)
```

类并不因为把状态和行为放在一起就自动产生高质量封装。Python 的属性默认仍然可被外部代码读取和修改；下划线命名表达非公开意图，但不能阻止访问。方法还可以读取和修改实例属性，因此一次方法调用的结果可能不只由本次调用写出的实参决定，还取决于这个实例此前经历过哪些方法调用、哪些属性赋值和哪些外部修改。

这种时间相关状态本身不是错误。计数器的当前计数、连接对象是否已经关闭、测量对象当前使用的单位，都可以是对象持续身份的一部分。把这类状态保存为实例属性，是类边界的合理职责。

风险出现在另一种情况：某个值只是一次计算的临时中间结果，却被长期保存为实例属性。后续方法可能依赖“之前必须先调用过某个方法”或“某个属性没有被外部改写”这类调用表面不可见的前提：

```python
class Calculator:
    def prepare(self, value):
        self.temp = value * 2

    def finish(self):
        return self.temp + 1
```

`finish()` 的调用表面没有参数，但它依赖 `prepare()` 必须先被调用。若调用顺序错了，或者 `temp` 被外部修改，行为就会变得难追踪。若数据只属于一次计算过程，局部变量、参数或返回值通常更清楚：

```python
def calculate(value):
    temp = value * 2
    return temp + 1
```

判断边界是：属于对象持续身份或长期约束的状态适合进入实例属性；只属于一次计算过程的数据更适合作为局部变量、参数或返回值。类建立组织边界，不自动保证封装质量。

## 类体中的表达式、`...` 和 `pass`

类体是一段会执行的代码块，因此类体里可以出现赋值、函数定义、表达式语句和控制流。导入模块并运行到类定义时，类体代码会立即执行，而不是等到创建实例时才执行。这也是为什么复杂类体可能引入副作用和定义顺序依赖。

`Ellipsis` 是 Python 预定义的单例对象；内置命名空间中的名字 `Ellipsis` 绑定到这个对象，字面写法 `...` 是求值得到同一个对象的表达式，因此 `Ellipsis is ...` 成立。[Python Standard Library: Built-in Constants][python-built-in-constants]

```python
Ellipsis is ...
# True
```

`...` 本身不是名字，也不是命名空间。只有在赋值中，求值得到的 `Ellipsis` 对象才会绑定到某个名字：

```python
class Sample:
    marker = ...
```

这里类命名空间中会出现 `marker -> Ellipsis 对象` 的绑定。若在类体中单独写：

```python
class Sample:
    ...
```

这是一条表达式语句：解释器求值得到 `Ellipsis` 对象，然后丢弃表达式结果，不会给类命名空间增加属性。

`pass` 不同。`pass` 是空语句，执行时不产生结果对象，也不能出现在需要表达式的位置：

```python
class Sample:
    pass
```

`pass` 表示类体当前位置没有任何要执行的语句效果；`x = pass` 或 `print(pass)` 不是合法代码。`...` 是表达式，`pass` 是语句，二者在类体里都能让代码块保持语法完整，但运行机制不同。

## 失败模式

类和实例的常见错误都能沿运行链定位。

把类对象误当成实例，会在尚未创建具体实体时读取实例状态：

```python
Measurement.value
# 普通情况下不存在这个类属性
```

`value` 是 `__init__` 给实例绑定的属性，不是类体中绑定的类属性。

把 `__init__` 误当成创建并返回实例的普通函数，会写出错误返回值：

```python
class Bad:
    def __init__(self):
        return self
```

`__init__` 的责任是初始化已经创建好的实例，不能返回替代对象。

遗漏方法的第一个实例形参，会在绑定方法调用时出现参数数量错误：

```python
class Bad:
    def scaled(factor):
        return factor * 2

Bad().scaled(2)
# TypeError
```

通过实例调用时，Python 会自动把当前实例作为第一个实参传入；函数定义如果没有对应形参，就会多出一个参数。

在方法体中写局部赋值而不是实例属性赋值，不会更新对象状态：

```python
def update(self, value):
    value = value * 2       # 局部名字
    self.value = value      # 实例属性
```

把可变对象写成类属性，会让多个实例共享同一个对象；把耗时操作、网络访问或文件修改放进类体，会让副作用在类定义执行时发生，而不是等到实例创建时发生。第 08 章会展开共享可变状态，第 10 章会展开对象协议和特殊方法。

## Java、C++ 与 Python 的不同约束位置

Java、C++ 和 Python 都要解决“如何让一类实体共享结构与行为，同时让每个具体实体保存自己的状态”这个问题。差异不在于谁有类，谁没有类，而在于约束放在哪一层。

Java 的类声明定义类及其成员，实例字段为每个实例分别产生，实例方法相对于某个具体对象调用；对象通常通过类实例创建表达式和构造器初始化，方法体中的当前实例由 `this` 表示。[Java Language Specification: Classes][jls-classes] Java 更早把类、字段、方法签名和类型关系交给编译器与 JVM 使用，换来更强的静态检查和平台约束。

C++ 的类说明符定义类类型，对象直接受存储期、构造、析构、布局和生命周期规则约束；非静态成员函数调用具有隐式对象参数。[C++ Draft: Classes][cpp-classes][C++ Draft: Objects and storage][cpp-objects] C++ 把对象放在哪里、什么时候构造、什么时候析构、布局和调用代价放在中心。

Python 则让类定义成为运行时执行，让类本身成为对象，让普通函数经属性访问形成绑定方法，并把接收实例的 `self` 保留在参数列表和函数体中。它把许多结构推到运行时对象、命名空间和属性查找上，换来交互、脚本、动态组织和统一对象模型的连续性；代价是错误更容易在运行时暴露，属性来源和方法绑定也需要程序员理解运行链。

## 最小代码练习

创建一个文件并运行以下代码：

```python
class Measurement:
    unit = "ms"

    def __init__(self, name, value):
        self.name = name
        self.value = value

    def scaled(self, factor):
        return Measurement(self.name, self.value * factor)


latency = Measurement("latency", 12.5)
throughput = Measurement("throughput", 80)

print(type(Measurement) is type)
print(type(latency) is Measurement)
print(latency is throughput)
print(latency.__dict__)
print(Measurement.unit)
print(latency.unit)

latency.unit = "second"
print(latency.unit)
print(throughput.unit)
print(Measurement.unit)

method = latency.scaled
print(method.__self__ is latency)
print(method.__func__ is Measurement.scaled)

twice = latency.scaled(2)
print(twice.__dict__)
```

观察重点不是输出格式，而是每一行对应的运行事实：

```text
Measurement 是类对象，它的运行时类型是 type。
latency 是实例对象，它的运行时类型是 Measurement。
两个实例有不同 identity。
实例属性保存在各自实例上。
类属性先保存在类对象上，实例可通过查找取得。
实例同名属性会遮蔽类属性。
实例访问类上的函数会形成绑定方法对象。
绑定方法对象保存当前实例和原函数。
```

## 反馈问题

1. `list` 和 `Measurement` 为什么都可以说是类对象或类型对象？它们的区别在哪里？
2. 执行 `class Measurement: ...` 时，类对象是在类体执行前已经存在，还是类体执行后创建？类命名空间在其中承担什么作用？
3. 调用 `Measurement("latency", 12.5)` 时，创建阶段和初始化阶段分别负责什么？
4. 为什么 `self.name = name` 会影响当前实例，而 `name = name` 不会建立实例属性？
5. 实例创建时会不会复制类对象上的所有属性绑定？`measurement.unit` 为什么能读到类属性？
6. `measurement.scaled` 和 `Measurement.scaled` 分别是什么对象？调用时 `self` 是怎样被传入的？
7. 什么状态适合保存为实例属性？什么数据更适合作为局部变量或返回值？

## 本章小结

`class` 把前五章的对象、名字、命名空间、函数和模块机制接到新的位置：类定义语句执行类体，类体中的赋值和 `def` 先进入类命名空间，类体结束后产生类对象，类名再绑定到这个类对象。这个类对象成为其实例的运行时类型，并参与实例创建、属性查找和方法绑定。

实例不是类对象的副本。类对象保存共同定义，实例对象保存具体状态；实例通过自己的运行时类型找到类对象，再取得类属性或类上函数。类上函数经实例访问时形成绑定方法对象，绑定方法对象保存原函数和当前实例，调用时再把当前实例传给显式第一个形参 `self`。

这条链为后续章节提供基础：第 07 章展开完整属性查找，第 08 章解释可变状态和共享对象，第 09 章解释继承与组合，第 10 章进入数据模型协议，第 11 章才能精确说明异常实例、异常类型匹配和 `with` 资源边界。

## Sources

- [Python Tutorial: Classes][python-classes]
- [Python Tutorial: Class objects and instance objects][python-class-instance-objects]
- [Python Tutorial: Method objects][python-method-objects]
- [Python Language Reference: Class definitions][python-class-definitions]
- [Python Execution Model: Class definition blocks][python-class-blocks]
- [Python Data Model: Objects, values and types][python-objects-types]
- [Python Data Model: Custom classes][python-custom-classes]
- [Python Data Model: Instance methods][python-instance-methods]
- [Python Data Model: Basic customization][python-basic-customization]
- [Python Standard Library: Built-in types][python-standard-types]
- [Python Standard Library: Built-in Constants][python-built-in-constants]
- [Python Design FAQ: Why must `self` be used explicitly?][python-explicit-self]
- [CPython C API: Objects, Types and Reference Counts][python-c-api-intro]
- [CPython C API: Method objects][python-c-api-method]
- [CPython source: `PyType_Type`][cpython-pytype-type]
- [Java Language Specification: Classes][jls-classes]
- [C++ Draft: Classes][cpp-classes]
- [C++ Draft: Objects and storage][cpp-objects]

[python-classes]: https://docs.python.org/3/tutorial/classes.html
[python-class-instance-objects]: https://docs.python.org/3/tutorial/classes.html#class-objects
[python-method-objects]: https://docs.python.org/3/tutorial/classes.html#method-objects
[python-class-definitions]: https://docs.python.org/3/reference/compound_stmts.html#class-definitions
[python-class-blocks]: https://docs.python.org/3/reference/executionmodel.html#class-definition-blocks
[python-objects-types]: https://docs.python.org/3/reference/datamodel.html#objects-values-and-types
[python-custom-classes]: https://docs.python.org/3/reference/datamodel.html#custom-classes
[python-instance-methods]: https://docs.python.org/3/reference/datamodel.html#instance-methods
[python-basic-customization]: https://docs.python.org/3/reference/datamodel.html#basic-customization
[python-standard-types]: https://docs.python.org/3/library/stdtypes.html
[python-built-in-constants]: https://docs.python.org/3/library/constants.html#Ellipsis
[python-explicit-self]: https://docs.python.org/3/faq/design.html#why-must-self-be-used-explicitly-in-method-definitions-and-calls
[python-c-api-intro]: https://docs.python.org/3/c-api/intro.html#objects-types-and-reference-counts
[python-c-api-method]: https://docs.python.org/3/c-api/method.html
[cpython-pytype-type]: https://github.com/python/cpython/blob/main/Objects/typeobject.c
[jls-classes]: https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html
[cpp-classes]: https://eel.is/c++draft/class
[cpp-objects]: https://eel.is/c++draft/intro.object
