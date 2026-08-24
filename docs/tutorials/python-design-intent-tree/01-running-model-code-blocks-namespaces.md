# 01. Python 为什么把代码运行成对象、名字和模块？

## 本章推理总览

Python 出现在 C、shell、ABC 和 Unix/C 生态交汇的环境里。C 能接触系统能力，但写系统小工具、胶水代码和临时程序成本高；shell 能快速串命令，但复杂数据结构、函数复用、错误处理、测试和大型程序组织能力薄；ABC 清晰，但不够开放，难以进入真实 Unix/C 工作方式。Python 要解决的不是“语法更简短”这一件事，而是让代码既能像脚本一样低成本运行，又能像真实程序一样被组织、复用、测试和扩展。

这个背景推出第一个判断：一段代码运行后，产生的东西不能只停留在文本输出、静态声明或文件路径上。文本流适合命令管道，但丢失结构；静态声明适合提前检查和大型工程约束，但会让交互、条件定义、运行时生成和动态导入受到更多编译期或加载期结构限制；每类东西各走一套规则可以局部优化，但数值、函数、类、模块、测试替身之间组合时会不断切换边界。Python 的选择是把运行时产生的值、函数、类、实例、模块和代码对象尽量放进对象模型，让它们共享“可被引用、可传递、可保存、可检查、可组合”的存在方式，再用各自的 type 区分行为。

对象模型不是终点，而是后续机制的起点。对象需要被代码找到，于是有名字绑定；名字不断增长，需要隔离和查找边界，于是有命名空间；一个文件执行后得到的一组顶层名字需要作为整体被复用，于是有模块对象；同一个模块既可能作为脚本入口运行，也可能被其他代码导入复用，于是需要入口身份。整章沿着这条链展开：对象解决运行时实体问题，名字解决访问问题，命名空间解决边界问题，模块解决文件级复用问题，入口身份解决运行和导入的分流问题。

对象、名字、命名空间和模块都发生在代码执行过程中。这里的“执行”包含两层：实现层先把源码解析、编译为字节码，虚拟机再执行字节码；语言层再把这些字节码动作造成的结果描述为对象、名字绑定和命名空间变化。字节码执行时会不断写入和读取运行时状态。写入状态包括取得或创建对象、把名字绑定到对象、把绑定写入命名空间、形成模块对象；读取状态包括从当前作用域、模块命名空间、对象属性或内置命名空间查找名字，取得对象引用，再根据对象类型执行操作。

这些语言规则还需要解释器在运行时实现。源码不是对象本身，字节码也不是对象本身；CPython 读取源码，编译成字节码，用解释器循环执行字节码，并在内存中维护对象结构、对象引用、虚拟机栈和模块字典。Python 语言层描述对象、名字、命名空间和绑定关系；CPython 实现层说明这些关系在动态执行时如何由具体数据结构和机器码执行逻辑形成。

## 本章证据底座

本章的历史背景来自 Python 官方 FAQ、Guido van Rossum 的 Python 前言、Computer Programming for Everybody 和 “Glue It All Together With Python”。这些材料说明 Python 诞生时面对的是 C、shell、ABC、Unix/C 生态、系统管理、快速开发、可扩展和组件粘合等压力。[Python General FAQ][python-faq][Guido van Rossum: Python Foreword][python-foreword][Computer Programming for Everybody][python-everybody][Glue It All Together With Python][python-glue]

本章的语言机制来自 Python Data Model、Execution Model、官方解释器教程、模块教程和 `__main__` 文档。对象、名字绑定、命名空间、代码块、模块导入、`-c`、`-m` 和入口身份，都以这些官方文档为事实边界。[Python Data Model][python-data-model][Python Execution Model][python-execution-model][Python Interpreter][python-interpreter][Python Modules][python-modules][Python `__main__`][python-main]

本章的系统层解释参考 Python glossary、CPython InternalDocs、Nand2Tetris、CS:APP、SICP 和 Crafting Interpreters，用来区分源码、字节码、机器码、解释器、进程、内存状态和语言模型。[Python Glossary: bytecode][python-bytecode][Python Glossary: interpreted][python-interpreted][CPython InternalDocs: interpreter][cpython-internal-interpreter][CPython InternalDocs: compiler][cpython-internal-compiler][Nand2Tetris][nand2tetris][CS:APP][csapp][SICP][sicp][Crafting Interpreters][crafting-interpreters]

跨语言比较参考 Java 语言白皮书、Java Language Specification、C++ 标准草案和 Stroustrup 的 C++ 设计说明。比较只用于说明不同语言如何在共同问题下选择不同中心。[The Java Language Environment][java-white-paper][Java Language Specification: Types, Values, and Variables][java-jls-types][C++ Object Model][cpp-object-model][C++ Types][cpp-types][Stroustrup FAQ: Why did you invent C++?][stroustrup-faq][Stroustrup FAQ: universal Object][stroustrup-universal-object]

“对象、名字、命名空间、模块构成 Python 脚本到程序的连续运行链”是本教程综合归纳，不是 Python 官方给出的固定术语。

## Python 最初需要一条连续的运行路径

Guido van Rossum 解释 Python 起源时提到两类压力。一类来自 ABC：ABC 有清晰表达和高层数据结构等优点，但封闭、难扩展，难以适应 Unix/C 用户需要接触系统调用和外部库的工作方式。另一类来自 Amoeba 分布式操作系统环境：系统管理和工具编写需要比 C 程序和 Bourne shell 脚本更合适的语言。[Python General FAQ][python-faq][Guido van Rossum: Python Foreword][python-foreword]

Amoeba 是当时 CWI 的分布式操作系统研究环境。这样的环境会遇到多台机器、多个服务、文件、进程、网络状态、系统接口和已有工具之间的管理与协调。系统管理代码经常要启动服务、检查状态、批量处理输出、调用底层接口、连接已有工具或库，并快速写临时程序验证想法。

这类工作暴露出一个夹缝：C 太重，shell 太薄。C 能接触系统能力，但写小工具常常要面对样板代码、编译链接、字符串处理、数据结构和内存管理。Bourne shell 能快速串命令，但复杂数据结构、函数复用、错误处理、测试和大型程序组织能力弱。

Python 要站在中间：像 shell 一样容易启动和自动化，像高级语言一样拥有结构化对象、函数、模块和异常，又能接触 Unix/C 生态并被外部系统扩展。这使 Python 一开始就不是单纯的“脚本语言”或“面向对象语言”。它要满足四个要求：

```text
比 C 更低表达成本
  小工具、系统管理、文本处理和胶水代码不应总是进入漫长的编译、链接和内存管理流程。

比 shell 更强结构能力
  命令串联之外，还要有数据结构、函数、错误处理、测试和可维护的程序组织。

比 ABC 更开放
  清晰表达和高层数据类型要能进入 Unix/C 生态，能调用外部库，也能被外部系统扩展。

从一行代码长到多文件程序
  交互输入、脚本文件、函数、类、模块和包不应是彼此断裂的世界。
```

这些要求共同提出一个问题：一段代码运行后，产生的东西应该以什么形式继续存在，才能被后续代码保存、传递、组合、导入和测试。

### 候选路线一：文本流

第一条路线是把运行结果主要当成文本流。shell 管道就是典型例子：前一个命令把文本写到标准输出，后一个命令从标准输入读取文本。

这条路线的优势是简单、通用、容易串联外部命令。`ls | grep py | sort` 不需要共享对象模型，不需要统一类型系统，也不需要复杂运行时；只要每个程序会读写文本，就能连接起来。

它的代价是文本不会保留语言级结构。文本里不会自然保留“这是整数、这是日期、这是用户对象、这是函数、这是模块状态”。中间结果一旦只剩普通文本，后续代码要重新解析字符串；测试也常常只能检查输出文本；函数和容器不能直接接住结构化结果。

Python 需要像 shell 一样容易启动和自动化，但不能只停在命令文本流。系统工具、测试、模块复用和长期演化需要结构化结果。Python 因此让表达式、函数调用、类创建、模块导入产生对象。对象可以直接传给函数，可以放进列表或字典，可以作为返回值，可以由测试代码直接断言。

### 候选路线二：静态声明结构

第二条路线是把函数、类、模块主要当成静态声明结构。静态声明结构指：程序运行前，源码先告诉编译器或加载器有哪些类型、函数、方法、字段、包和模块边界；编译器据此检查类型、生成代码、安排链接或类加载。Java 和 C++ 大量依赖这条路线。

这条路线的优势是约束强、检查早、结构稳定。大型工程可以依靠编译器、类型系统、链接器、类加载器和构建系统提前发现许多错误；性能、内存布局、安全边界和部署形态也更容易被系统化管理。

它的代价是许多结构更早被固定在编译期或加载期。交互输入、条件定义、运行时生成和动态导入会受到更多约束。Python 可以在 `if` 的不同分支里定义同一个函数名，让运行路径决定名字绑定到哪个函数对象；也可以把函数放进字典、注册到插件表、根据字符串导入模块。静态声明路线也能实现类似能力，但通常要通过接口、反射、类加载器、模板、宏、构建系统或框架完成，而不是天然走同一条“执行代码，产生对象，绑定名字”的路径。

Python 的起点要求交互实验、小脚本、函数、类和模块自然连在一起，而不是让学习者和工具作者过早进入声明、编译、链接和加载的多层流程。它更重视运行时组合和低启动成本，因此把函数、类、模块也放进运行时对象模型。

### 候选路线三：每类东西各走一套规则

第三条路线是让每类东西各走一套规则。这里的规则指：某类东西如何产生、如何命名、能不能赋值、能不能传参、能不能返回、能不能放进容器、能不能有属性、能不能被导入、能不能被测试替换。假设数值可以赋值和传参，但函数只能声明后调用；类只能作为编译期类型使用；模块只能作为文件路径加载；代码块不能成为运行时对象。

这里的“组合”指把程序里不同种类的东西接起来，让前一步产生的东西能被后一步继续使用。例如：把表达式结果交给函数，把函数放进列表或字典，把函数作为参数传给另一个函数，让类对象被装饰器修改，把模块导入后交给别的代码使用，把一个函数替换成测试版本。组合需要规则，是因为语言必须规定“这个东西能不能被这样接”。数值能传参，不代表函数也能；函数能调用，不代表它能放进容器；模块能加载，不代表它能像对象一样被传递或替换。

这条路线的优势是每类机制都能为自己的目标优化。数值可以追求紧凑和快速；函数可以追求调用效率；类可以服务静态结构；模块可以服务加载和发布边界。许多语言都会在不同程度上采用这种分工。

它的代价是组合时要不断切换规则。数值、函数、类、模块之间无法自然互换位置；学习者必须记住哪些东西能赋值，哪些东西能传参，哪些东西能放进容器，哪些东西能作为属性暴露，哪些东西能被测试替换。语言仍然可以运行，但从小脚本长到多文件程序时，机制之间容易出现断层。

Python 的选择是减少这种分裂。数值、字符串、列表、字典、函数、类、实例、模块和代码对象虽然类型不同，但尽量进入同一个对象模型。差异不被消灭，而是落在对象的类型和行为上；共同点则由对象、名字、命名空间和模块承担。

这条路线的好处是连续：交互表达式得到对象，赋值把名字绑定到对象，`def` 得到函数对象，`class` 得到类对象，`import` 得到模块对象，容器保存对象引用，测试直接检查对象行为。它能把 shell 的低启动成本、高级语言的结构能力、模块化复用和 C/Unix 生态扩展放进同一条运行路径。

这条路线也有成本：许多错误要到运行时才暴露；解释器需要在运行时做类型检查和分发；对象模型、动态绑定和命名空间查找带来性能开销；大型项目需要靠测试、类型标注、模块边界和工程规范补足约束。Python 不是没有代价地赢过其他路线，而是在“快速表达、立即执行、运行时组合、可扩展、脚本到程序连续成长”这组目标下选择了更合适的代价。

## 动态执行：写入状态和读取状态

对象、名字、命名空间和模块都发生在代码执行过程中。这里的“执行”包含两层：实现层先把源码解析、编译为字节码，虚拟机再执行字节码；语言层再把这些字节码动作造成的结果描述为对象、名字绑定和命名空间变化。字节码执行时会不断写入和读取运行时状态。

写入状态回答运行时世界如何形成：

```text
源码被编译为字节码
-> 虚拟机执行字节码
-> 指令取得或创建对象
-> 指令把名字绑定到对象
-> 命名空间保存 name -> object
-> 文件级命名空间形成模块状态
```

读取状态回答后续代码如何找到并操作已经形成的东西：

```text
后续字节码继续执行
-> 从当前作用域、模块命名空间或内置命名空间查找名字
-> 取得名字绑定的对象引用
-> 根据对象类型决定能执行什么操作
```

例如：

```python
x = 10
print(x + 1)
```

第一行写入运行时状态：

```text
源码 x = 10 被编译为字节码
-> 虚拟机执行加载常量的指令
-> 取得或创建 int 对象 10
-> 虚拟机执行保存名字的指令
-> 当前命名空间写入 x -> int 对象 10
```

第二行读取运行时状态：

```text
虚拟机执行 print(x + 1) 对应的字节码
-> 查找名字 print，取得内置函数对象
-> 查找名字 x，取得 int 对象 10
-> 取得 int 对象 1
-> 根据 int 类型执行加法，得到结果对象 11
-> 调用 print 函数对象
```

因此，`name -> object` 不是源码阶段天然存在的东西。它是虚拟机执行字节码时写入命名空间的运行时状态；后续字节码再从命名空间中读取这个绑定，并继续操作对象。

## 对象：运行后真正可组合的单位

Python 官方数据模型把对象定义为 Python 对数据的抽象，并说明 Python 程序中的所有数据都由对象或对象之间的关系表示；每个对象都有 identity、type 和 value。[Python Data Model][python-data-model]

这里的“数据”是宽义的运行时数据，不只是业务数据、数字、字符串、表格或文件内容。它指 Python 运行时能够用对象模型表示和处理的东西。整数、字符串、列表、字典是对象；函数、类、实例、模块也是对象；编译后的代码也可以表现为代码对象。源码文本只是解释器的输入，源码被解析、编译、执行后，才会在运行时产生函数对象、类对象、模块对象和代码对象等实体。[Python Data Model][python-data-model]

对象的三个核心属性分别回答三个问题：

```text
identity
  这个对象是谁。
  对象在一次运行中有自己的身份，is 比较的就是对象身份。

type
  这个对象是哪一类。
  类型决定对象支持哪些操作，例如整数能做数值运算，函数能被调用，模块能暴露属性。

value
  这个对象当前表示什么内容。
  例如整数对象的值是 10，字符串对象的值是 "hello"，列表对象的值是它包含的一组元素引用。
```

这三个属性对应 Python 需要的运行时能力：

```text
identity
  让一个对象能被多个名字、容器或属性共同引用。

type
  让解释器知道这个对象支持什么操作。

value
  让对象保存当前内容，使后续代码能继续读取和组合。
```

在 Python 语言层，identity 是对象在一次运行中的唯一身份。对象创建后，identity 不会改变；`is` 比较的是两个名字或表达式最终找到的对象是不是同一个对象；`id()` 返回表示对象 identity 的整数。Python 数据模型明确说明，在 CPython 中，`id()` 通常就是对象的内存地址；这是 CPython 实现方式，不是 Python 语言层要求所有实现都必须暴露真实地址。[Python Data Model][python-data-model]

在 CPython 实现层，多数运行时对象由 `PyObject*` 这样的 C 指针访问。普通对象结构有共同的基础部分：引用计数和指向类型对象的指针；具体类型对象再在这个基础上保存自己的数据。整数对象、列表对象、函数对象、模块对象内部结构不同，但都能以“指向 Python 对象的引用”进入赋值、参数传递、容器保存和命名空间映射等通用机制。[Python/C API: Objects, Types and Reference Counts][python-c-api-intro][Python/C API: Common Object Structures][python-c-api-structures]

```python
x = [1, 2]
y = x
z = [1, 2]

print(x is y)  # True
print(x is z)  # False
print(x == z)  # True
```

这段代码里有两个列表对象。`x = [1, 2]` 创建一个列表对象。CPython 会在内存中拥有一个列表对象结构；当前命名空间保存名字到对象引用的映射：

```text
x -> 第一个 list 对象
```

`y = x` 不是复制列表内容，而是先在当前命名空间查找名字 `x`，取得第一个列表对象的引用，再保存另一个名字到同一对象引用的绑定：

```text
y -> 第一个 list 对象
```

因此 `x is y` 为 `True`。`z = [1, 2]` 会创建第二个列表对象：

```text
z -> 第二个 list 对象
```

两个列表的内容相同，所以 `x == z` 为 `True`；但它们不是同一个对象，所以 `x is z` 为 `False`。这正是 identity 和 value 的区别：identity 判断是不是同一个对象，value 判断对象表示的内容是否相等。

共享 identity 会影响可变对象：

```python
x = [1, 2]
y = x

x.append(3)
print(y)
```

输出是：

```text
[1, 2, 3]
```

原因不是 `x` 把列表内容复制给了 `y`，而是 `x` 和 `y` 都绑定到同一个列表对象。通过 `x` 修改对象后，通过 `y` 找到的仍然是同一个对象。名字绑定的实质是：命名空间保存名字到对象引用的映射。

对象携带类型还解释了 Python 的动态性：

```python
x = 10
x + 1

x = "hello"
x + " world"

x = [1, 2]
x + [3]
```

三段代码里的名字都叫 `x`，但 `x` 先后绑定到 `int` 对象、`str` 对象和 `list` 对象。解释器执行 `+` 时，先通过名字找到对象，再看对象的类型：`int` 对象走数值加法，`str` 对象走字符串拼接，`list` 对象走列表拼接。发生变化的不是名字 `x` 的声明类型，而是 `x` 当前绑定到哪个对象。

Python 使用对象不是为了把所有东西说成同一种东西。函数对象和整数对象不同，模块对象和列表对象也不同。统一发生在更底层的运行规则上：对象都能被名字引用、作为参数传递、作为返回值返回、放进容器、参与身份比较，并且都能在条件判断中形成真假结果。[Python Data Model][python-data-model][Python Truth Value Testing][python-truth]

差异由对象的 type 决定。`int` 对象能做数值运算，`function` 对象能被调用，`list` 对象能保存一组对象引用，`module` 对象能通过属性暴露名字，`class` 对象能被调用来创建实例。统一的是对象的存在方式和引用方式；不同的是每种类型提供的操作集合。

## 名字：代码找到对象的方式

源码里写的是 `x`、`format_price`、`User`、`price` 这些符号；运行时存在的是对象。语言必须规定符号如何连接到对象。

Python 的答案是名字绑定。名字不是对象本身；名字是当前命名空间里用来找到对象的符号。赋值、函数定义、类定义、导入等操作都会引入名字绑定。[Python Execution Model][python-execution-model]

赋值会在当前命名空间中建立或更新名字到对象的绑定：

```python
x = 10
y = x
x = "hello"
```

运行关系是：

```text
x 先绑定到 int 对象 10
y 也绑定到 int 对象 10
x 后来重新绑定到 str 对象 "hello"
```

名字和对象分开后，同一个对象可以被多个名字引用，一个名字也可以在之后绑定到另一个对象。

函数定义接在同一条规则上：

```python
def greet(name):
    return f"Hello, {name}"
```

虚拟机执行外层代码中创建函数的字节码时，会创建函数对象，并把名字 `greet` 绑定到这个函数对象。[Python Execution Model][python-execution-model]

```text
执行 def greet 对应的字节码
-> 创建 function 对象
-> 当前命名空间写入 greet -> function 对象
```

条件定义能直接显示“执行路径决定绑定结果”：

```python
flag = True

if flag:
    def greet():
        return "hello"
else:
    def greet():
        return "bye"

print(greet())
```

名字 `greet` 最终绑定到哪个函数对象，取决于运行时 `flag` 的值。代码没有执行到的那条 `def`，不会在当前命名空间里产生对应绑定。

函数对象还可以被赋给另一个名字：

```python
hello = greet
print(hello())
```

这里不是复制函数体，而是让 `hello` 也绑定到同一个函数对象。回调函数、装饰器、函数注册和测试替换，都接在这个基础上。

类定义同样是执行：

```python
class User:
    pass

u = User()
```

执行 `class User` 会创建类对象，并把名字 `User` 绑定到它。调用类对象 `User()` 会创建实例对象。类本身是对象，类创建出来的实例也是对象，只是二者类型和行为不同。

到这里，赋值、函数、类已经不是三组孤立语法，而是同一条写入状态规则的三个例子：

```text
x = 10
  -> 名字 x 绑定到 int 对象

def f(): ...
  -> 名字 f 绑定到 function 对象

class User: ...
  -> 名字 User 绑定到 class 对象
```

## 命名空间：名字增长后的边界

名字一多，就必须有边界。程序只有几行时，所有名字放在一起还能忍受。程序一旦有函数、类、多个文件和第三方库，`config`、`connect`、`format`、`main` 这类名字会反复出现。如果所有名字进入同一张全局表，复用会迅速失控。

Python 的答案是命名空间。命名空间是一组名字到对象的映射；模块、函数调用和类定义都会形成或使用不同的命名空间。[Python Execution Model][python-execution-model][Python Classes: Scopes and Namespaces][python-classes]

命名空间不是一段连续的物理内存。语言层关心的是映射关系：

```text
命名空间 = 名字 -> 对象
```

CPython 实现层通常用字典和对象引用保存这类映射。例如模块对象承载的文件级命名空间可以通过模块对象的 `__dict__` 观察。

模块顶层有：

```python
tax_rate = 0.08

def format_price(cents):
    return f"${cents / 100:.2f}"
```

执行后，当前模块命名空间至少保存：

```text
tax_rate      -> float 对象
format_price  -> function 对象
```

后续字节码会读取这条命名空间状态：

```python
format_price(2500)
```

```text
查找名字 format_price
-> 找到 function 对象
-> 调用这个函数对象
```

命名空间把“对象如何被创建”与“名字如何被查找”接在一起：执行前面的代码会写入绑定，执行后续代码会读取绑定。

## 模块：文件级命名空间成为可复用对象

Python 的低启动成本要求一个 `.py` 文件可以直接运行；真实工程又要求代码可以拆分、导入、测试和复用。模块就是这两种需求之间的桥。

解释器会话中的定义会随会话结束而消失；较长程序写入文件后，代码获得稳定的保存位置；程序继续变长后，再拆成多个文件，避免复制同一个函数。这样的 `.py` 文件就是模块，模块中的定义可以被其他模块导入。[Python Modules][python-modules]

创建 `price.py`：

```python
tax_rate = 0.08

def format_price(cents):
    return f"${cents / 100:.2f}"
```

导入它：

```python
import price
```

这句话不是把 `price.py` 里的所有名字复制到当前文件。它通常是在当前命名空间里绑定一个名字 `price`，这个名字指向模块对象；模块对象承载 `price.py` 执行后的文件级命名空间。

```text
当前命名空间
  price -> module 对象

price 模块命名空间
  tax_rate -> float 对象
  format_price -> function 对象
```

调用时写：

```python
print(price.format_price(2500))
```

读取状态的过程是：

```text
查找当前命名空间里的 price
-> 找到 module 对象
-> 在 price 模块对象上查找 format_price
-> 找到 function 对象
-> 调用这个函数对象
```

模块是对象这件事，使“文件边界”和“运行时对象模型”接上了。模块不只是磁盘路径，也不只是源码文本；导入后，它成为承载一组名字绑定的对象。在 CPython 中，模块命名空间通常可以通过模块对象的 `__dict__` 观察：

```python
import price

print(price.__dict__["format_price"])
print(price.format_price)
```

这个例子展示的是 CPython 层的可观察实现细节。语言层的规则仍然是：模块对象承载文件级命名空间，`import price` 在当前命名空间绑定模块对象，而不是展开模块内部所有名字。

## 入口身份：同一个模块区分运行和导入

同一个 `.py` 文件经常有两种用途：

```text
直接运行
  python price.py

被其他代码导入
  import price
```

两种方式都会让模块代码被执行，但意图不同。直接运行时，文件承担一次任务的入口。被导入时，调用方通常只想复用里面的函数、类或常量。如果导入也自动打印、读文件、发请求、解析命令行或启动服务，测试和复用都会失控。

Python 用模块的 `__name__` 区分身份。被导入时，模块的 `__name__` 通常是模块名；作为本次运行的入口模块时，`__name__` 是 `"__main__"`。[Python `__main__`][python-main]

```python
def format_price(cents):
    return f"${cents / 100:.2f}"

def main():
    print(format_price(1299))

if __name__ == "__main__":
    main()
```

这段代码分成三层：

```text
format_price
  可导入、可测试、可复用的业务函数。

main
  组织一次命令行运行的入口流程。

if __name__ == "__main__"
  只在这个文件作为入口模块时启动 main。
```

同一段代码也能展示写入状态和读取状态。

写入状态：

```text
虚拟机执行 def format_price 对应的字节码
-> 创建函数对象
-> 当前模块命名空间写入 format_price -> 函数对象

虚拟机执行 def main 对应的字节码
-> 创建函数对象
-> 当前模块命名空间写入 main -> 函数对象
```

读取状态：

```text
虚拟机执行 if __name__ == "__main__" 对应的字节码
-> 在当前模块命名空间查找 __name__
-> 如果它的值是 "__main__"，继续执行 main()

虚拟机执行 main() 对应的字节码
-> 在当前模块命名空间查找 main
-> 找到 main 绑定的函数对象
-> 调用这个函数对象
```

`main()` 不是 Python 强制要求的特殊入口函数。它只是普通函数。真正的入口标记是模块身份 `"__main__"`。Python 没有像 Java 那样要求所有程序从固定签名的 `main` 方法开始，因为 Python 要保留交互输入和脚本文件的低启动成本。代价是模块顶层代码会在导入时执行，所以入口行为需要放进 `if __name__ == "__main__"` 保护。

## CPython 如何执行这套模型

前面解释的是 Python 语言层规则。运行 `python price.py 1299` 时，这套规则在 CPython 中落到解释器执行过程：

```text
操作系统
  -> 启动 python 可执行程序
  -> 创建 python 进程
  -> 把当前目录、环境变量、标准输入输出和命令行参数交给进程

CPU
  -> 执行 python 进程中的 CPython 机器码

CPython 解释器
  -> 从命令行参数中知道入口文件是 price.py
  -> 读取 price.py 源码
  -> 解析并编译成 Python 字节码
  -> 让 CPython 虚拟机解释执行字节码

Python 运行时
  -> 创建或取得对象
  -> 把名字绑定到对象
  -> 把绑定保存到模块命名空间
  -> 把入口模块身份设置为 __main__
```

这条链里有三类代码：

```text
源码
  .py 文件中的 Python 文本，描述程序要做什么。

Python 字节码
  CPython 从源码编译出的中间指令，指挥虚拟机做哪些动作。

机器码
  python 解释器程序本身已经编译好的 CPU 指令。
```

`python price.py` 不是 CPU 直接执行 `price.py`。CPU 执行的是 CPython 解释器的机器码；CPython 解释器读取 `price.py`，生成 Python 字节码，再用虚拟机执行这些字节码。Python glossary 说明 bytecode 是 CPython 解释器内部的表示，Python 是 interpreted 的说法也因为存在 bytecode compiler 而不是绝对边界。[Python Glossary: bytecode][python-bytecode][Python Glossary: interpreted][python-interpreted]

“解释执行字节码”也不是把每条 Python 字节码临时翻译成新的 CPU 机器码。CPython 预先编译好一整套处理 Python 字节码的机器码逻辑。运行时，Python 字节码更像操作编号：虚拟机读到某条字节码，判断它表示哪类操作，然后进入 CPython 内部已经写好的处理逻辑；CPU 执行那段已有机器码，完成对象创建、名字绑定、函数调用、异常处理等动作。CPython InternalDocs 把解释器核心描述为对 bytecode instructions 的执行循环，compiler 文档则描述源码到字节码的编译过程。[CPython InternalDocs: interpreter][cpython-internal-interpreter][CPython InternalDocs: compiler][cpython-internal-compiler]

概念上可以这样看：

```text
CPython 虚拟机读取一条 Python 字节码
-> 判断这条字节码表示哪种操作
-> 分发到 CPython 内部已经写好的处理逻辑
-> CPU 执行那段已经存在的机器码
-> 处理对象、虚拟机栈、名字、函数调用、异常等运行时状态
-> 继续读取下一条 Python 字节码
```

运行时实体不是第三种文件，也不是源码旁边的另一段文本。它是在解释器执行字节码之后，于内存中形成、并被 Python 语言模型承认为可继续操作的对象和关系。源码描述意图，字节码驱动执行，解释器维护内存状态，语言模型把这些状态解释成“对象存在、名字绑定到对象、命名空间保存绑定”。

四层可以对应起来：

```text
源码文本
  描述程序要做什么。

Python 字节码
  指挥解释器做哪些动作。

解释器内存状态
  CPython 执行字节码时维护对象结构、引用、虚拟机栈、模块字典。

Python 语言模型
  把这些实现状态抽象成对象、名字、命名空间和绑定关系。
```

对象不是字节码本身。字节码是解释器实现语言模型的动作清单；对象、名字和命名空间是执行这些动作后，在 Python 语言层呈现出来的运行时世界。

## `-c` 和 `-m`：同一运行模型的不同入口

Python 解释器不只运行文件。官方教程列出几种启动方式，包括交互输入、运行脚本文件、执行 `-c` 字符串、用 `-m` 运行模块。[Python Interpreter][python-interpreter]

`-c` 把命令行中的字符串当作 Python 代码执行：

```shell
python -c "print(2 + 3)"
python -c "import sys; print(sys.version)"
```

它适合临时验证表达式、查看环境、做一次性检查。它不适合承载可维护程序，因为代码被塞进字符串后难以阅读、测试、复用和版本管理。

`-m` 按模块名找到代码，并把它作为入口运行：

```shell
python -m pip --version
python -m json.tool data.json
python -m http.server 8000
```

`-m` 后面写的是模块名或包名，不是文件路径。假设当前目录有：

```text
test.py
```

在当前目录位于模块搜索路径时，可以运行：

```shell
python -m test
```

这里的 `test` 是模块名。Python 按导入系统的规则找到 `test.py`，但把它作为本次入口执行。执行期间，它的模块身份仍是：

```python
__name__ = "__main__"
```

文件名和模块名不总是一对一。包会把目录结构转成点分模块名：

```text
shop/
  __init__.py
  price.py
```

运行：

```shell
python -m shop.price
```

磁盘路径是 `shop/price.py`，模块名是 `shop.price`。模块名表达的是导入系统中的位置，不只是文件名。

包也可以有自己的入口：

```text
shop/
  __init__.py
  __main__.py
```

运行：

```shell
python -m shop
```

命令中写的是包名 `shop`，实际执行的是 `shop/__main__.py`。

`-m` 后面还可以继续跟程序参数：

```shell
python -m test hello world
```

其中 `test` 用来定位入口模块；`hello world` 是交给入口模块处理的参数。程序内部可以通过 `sys.argv` 读取命令行参数。[Python sys.argv][python-sys-argv]

```python
import sys

print("__name__:", __name__)
print("argv:", sys.argv)
```

这条命令的结构是：

```text
python
  启动解释器。

-m test
  按模块名 test 找到入口代码。

hello world
  作为程序参数交给入口模块。
```

`-c`、脚本文件和 `-m` 只是入口不同，没有脱离本章主线：

```text
给解释器一段代码
-> 编译并执行代码
-> 写入或读取对象、名字绑定和命名空间状态
-> 根据入口身份决定是否启动入口行为
```

## 回看另外两条路线：Java、C++ 与 Python 的不同中心

前面的三条候选路线并不是“错路”。文本流、静态声明结构、分层规则都能解决一部分程序组织问题，只是服务的目标不同。把 Java 和 C++ 放在这里比较，是为了回到同一个问题：一门语言如何组织运行时存在的东西，如何让代码找到它们，如何把小程序扩展成大程序。

Python、Java 和 C++ 都要处理值、可调用代码、用户定义结构、名字边界和程序组织。差异不在于谁有这些问题，而在于每种语言把什么放在中心，什么交给其他层。Python 把运行时对象、名字绑定、命名空间和模块对象放在中心；Java 更重视静态类型、类、接口、包、字节码验证和 JVM 平台；C++ 更重视存储、生命周期、类型、布局、编译期机制和零开销抽象。

Java 的核心压力来自另一类环境：异构网络、可移植程序、安全执行、可靠组件和大型工程。Java 白皮书把 Java 描述为 simple、object-oriented、robust、secure、architecture-neutral、portable、interpreted、multithreaded 和 dynamic；这些词连在一起，指向的是“程序可以在不同机器上运行，并且运行前后都能被平台约束住”。[The Java Language Environment][java-white-paper]

这个目标会自然推向静态类型、类、接口、包、字节码验证和 JVM。原因是：如果程序要在不同机器上安全运行，平台必须能在运行前或加载时知道“这个值是什么类型、这个方法能不能被调用、这个字段是否存在、这段字节码是否破坏安全边界”。类型不只是写给读者看的标注，而是编译器、字节码验证器、类加载器和 JVM 共同使用的约束信息。

所以 Java 没有把所有运行时东西都压成 Python 式统一对象规则。Java 语言规范明确把类型分为 primitive types 和 reference types；`int`、`boolean` 这类 primitive value 不是普通对象，对象主要是类实例和数组。[Java Language Specification: Types, Values, and Variables][java-jls-types] 这不是偶然缺口，而是设计取舍：primitive values 让基础数值更贴近 JVM 的高效表示；reference values 和类实例承担面向对象组织；静态类型、类和接口承担提前检查与平台约束。Java 的对象模型很重要，但它服务的是“安全、可靠、可移植的平台化程序”，不是 Python 那种“执行到哪里，那里产生可组合运行时对象”的低启动路径。

C++ 的核心压力更靠近系统编程：保留 C 的效率和系统接近性，同时加入更强的类型检查、数据抽象和面向对象设施。Stroustrup 对 C++ 起源的说明反复围绕这个目标：不放弃 C 的性能和底层控制，又要给大型程序更好的抽象工具。[Stroustrup FAQ: Why did you invent C++?][stroustrup-faq]

这个目标会自然推向存储、生命周期、类型、布局和编译期机制。原因是：系统编程经常要关心对象放在哪里、什么时候构造、什么时候析构、内存布局是什么、调用是否有额外开销、能否直接和 C ABI 或硬件边界交互。C++ 标准里的 object 与 storage、lifetime、type、layout 关系紧密；函数不是 object。[C++ Object Model][cpp-object-model][C++ Types][cpp-types]

因此，C++ 不适合把所有东西都放进一个统一运行时对象模型里。强制 universal `Object` 会让许多值必须经过统一运行时表示、间接访问或共同基类约束，这会破坏 C++ 很重视的静态类型安全、泛型、布局控制和零开销抽象。Stroustrup 明确反对强制从 universal `Object` 派生，理由正接在这里：C++ 希望不同抽象在不使用时不付出运行时代价。[Stroustrup FAQ: universal Object][stroustrup-universal-object]

这样回看，三门语言的差异不是孤立语法差异，而是不同目标把约束放到了不同层：

```text
Python
  目标压力：交互实验、脚本、系统工具、胶水代码、从小文件长到模块化程序。
  中心机制：运行时对象、名字绑定、命名空间、模块对象。
  直接结果：值、函数、类、模块都能在运行时被创建、引用、传递、保存、导入和测试。
  代价：更多检查推迟到运行时；解释器需要动态查找、类型分发和对象管理。

Java
  目标压力：异构平台、安全执行、可靠组件、大型工程约束。
  中心机制：静态类型、类、接口、包、JVM bytecode、字节码验证。
  直接结果：编译器和 JVM 能提前利用类型与类结构检查程序，平台能约束加载和执行。
  代价：primitive/reference 分裂仍然存在；运行时组合通常要经过类、接口、反射、框架或加载机制。

C++
  目标压力：系统编程、C 兼容、性能、内存和资源精确控制。
  中心机制：对象存储、生命周期、类型、布局、模板、编译期机制。
  直接结果：程序员能控制对象放置、构造析构、布局、调用开销和资源释放。
  代价：语言模型更复杂；函数、对象、类型、模板、链接和生命周期不是 Python 式统一运行时对象规则。
```

Python 没有选择“所有东西先写成静态声明，再由编译期结构固定下来”，不是因为那条路不能运行，而是因为那条路不服务 Python 最初最强的目标：快速表达、立即运行、运行时组合、开放扩展，以及让小脚本自然长成模块化程序。

## 最小代码练习

创建 `price.py`：

```python
def format_price(cents):
    dollars = cents / 100
    return f"${dollars:.2f}"

def main():
    print("__name__ in price.py:", __name__)
    print(format_price(1299))

if __name__ == "__main__":
    main()
```

创建 `check_price.py`：

```python
import price

print("__name__ in check_price.py:", __name__)
print(price.format_price(2500))
```

分别运行：

```shell
python price.py
python check_price.py
python -m price
python -c "import price; print(price.format_price(9900))"
```

观察四件事：

```text
哪一次 price.py 的 __name__ 是 "__main__"？
哪一次 price.py 的 __name__ 是 "price"？
为什么 import price 后没有执行 main()？
python -c 中的 import price 为什么仍然能复用 format_price？
```

## 反馈问题

1. Python 为什么不把运行结果主要设计成文本流？
2. 对象的 identity、type、value 分别回答什么问题？
3. `x = 10` 和 `print(x + 1)` 分别如何写入和读取运行时状态？
4. `def f(): ...` 执行后，Python 运行时多出了什么对象和绑定？
5. `import price` 后，当前命名空间新增的是 `price` 还是 `format_price`？
6. `python price.py` 和 `python -m price` 都能运行同一个文件，它们共同点和区别是什么？

## 本章小结

Python 第一条运行主线不是语法清单，而是一条连续推演：

```text
Python 需要比 C 更低成本、比 shell 更结构化、比 ABC 更开放的运行路径
-> 运行产生的东西必须能保存、传递、组合、导入和测试
-> 对象成为运行时实体的统一单位
-> 名字让代码找到对象
-> 命名空间隔离不断增长的名字
-> 模块对象承载文件级命名空间
-> 入口身份区分入口运行和导入复用
```

写入运行时状态说明对象和绑定如何产生；读取运行时状态说明后续字节码如何从入口、命名空间和名字找到对象，并根据对象类型执行操作。赋值、函数定义、类定义、模块导入、入口身份、`-c` 和 `-m` 都是这条运行模型的不同位置。

## Sources

- [Python General FAQ][python-faq]
- [Guido van Rossum: Python Foreword][python-foreword]
- [Computer Programming for Everybody][python-everybody]
- [Glue It All Together With Python][python-glue]
- [Python Data Model][python-data-model]
- [Python Execution Model][python-execution-model]
- [Python Interpreter][python-interpreter]
- [Python Modules][python-modules]
- [Python `__main__`][python-main]
- [Python Glossary: bytecode][python-bytecode]
- [Python Glossary: interpreted][python-interpreted]
- [Python/C API: Objects, Types and Reference Counts][python-c-api-intro]
- [Python/C API: Common Object Structures][python-c-api-structures]
- [Python Classes: Scopes and Namespaces][python-classes]
- [Python Truth Value Testing][python-truth]
- [Python sys.argv][python-sys-argv]
- [CPython InternalDocs: interpreter][cpython-internal-interpreter]
- [CPython InternalDocs: compiler][cpython-internal-compiler]
- [Crafting Interpreters][crafting-interpreters]
- [SICP][sicp]
- [Nand2Tetris][nand2tetris]
- [CS:APP][csapp]
- [The Java Language Environment][java-white-paper]
- [Java Language Specification: Types, Values, and Variables][java-jls-types]
- [C++ Object Model][cpp-object-model]
- [C++ Types][cpp-types]
- [Stroustrup FAQ: Why did you invent C++?][stroustrup-faq]
- [Stroustrup FAQ: universal Object][stroustrup-universal-object]

[python-faq]: https://docs.python.org/3/faq/general.html
[python-foreword]: https://docs.python.org/3/license.html#foreword-for-python
[python-everybody]: https://www.python.org/doc/essays/cp4e/
[python-glue]: https://www.python.org/doc/essays/omg-darpa-mcc-position/
[python-data-model]: https://docs.python.org/3/reference/datamodel.html
[python-execution-model]: https://docs.python.org/3/reference/executionmodel.html
[python-interpreter]: https://docs.python.org/3/tutorial/interpreter.html
[python-modules]: https://docs.python.org/3/tutorial/modules.html
[python-main]: https://docs.python.org/3/library/__main__.html
[python-bytecode]: https://docs.python.org/3/glossary.html#term-bytecode
[python-interpreted]: https://docs.python.org/3/glossary.html#term-interpreted
[python-c-api-intro]: https://docs.python.org/3/c-api/intro.html#objects-types-and-reference-counts
[python-c-api-structures]: https://docs.python.org/3/c-api/structures.html
[python-classes]: https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces
[python-truth]: https://docs.python.org/3/library/stdtypes.html#truth-value-testing
[python-sys-argv]: https://docs.python.org/3/library/sys.html#sys.argv
[cpython-internal-interpreter]: https://github.com/python/cpython/blob/main/InternalDocs/interpreter.md
[cpython-internal-compiler]: https://github.com/python/cpython/blob/main/InternalDocs/compiler.md
[crafting-interpreters]: https://craftinginterpreters.com/
[sicp]: https://mitpress.mit.edu/9780262543231/structure-and-interpretation-of-computer-programs/
[nand2tetris]: https://www.nand2tetris.org/
[csapp]: https://csapp.cs.cmu.edu/3e/perspective.html
[java-white-paper]: https://www.oracle.com/java/technologies/language-environment.html
[java-jls-types]: https://docs.oracle.com/en/java/javase/26/docs/specs/jls/jls-4.html
[cpp-object-model]: https://eel.is/c++draft/intro.object
[cpp-types]: https://eel.is/c++draft/basic.types
[stroustrup-faq]: https://www.stroustrup.com/bs_faq.html#invention
[stroustrup-universal-object]: https://stroustrup.com/bs_faq2.html#no-derivation
