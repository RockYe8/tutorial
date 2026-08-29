# 11. Python 为什么用异常和上下文管理器划定失败与资源边界？

## 本章推理总览

前五章已经让 Python 程序拥有对象、容器、函数、模块和可读结构；第 06 至第 10 章又补上了类与实例、属性查找与方法绑定、可变状态、继承与组合，以及由特殊方法形成的对象协议。程序至此不仅能够运行和组合，还能说明一个具体对象属于哪个类、状态与行为如何被找到、父子类型如何形成概括关系，以及语法如何调用对象提供的协议。真实执行却不保证每个表达式、函数调用和资源操作都能完成：名字可能不存在，参数对象可能不符合操作要求，文件可能无法打开，已经取得的外部资源也可能在函数尚未正常返回时需要释放。一旦失败发生，程序同时面对两个彼此相关但不能混为一谈的问题：未完成的正常路径应当在哪里停止、由谁决定恢复或终止；已经取得的资源和临时状态又必须在什么时机退出或还原。

这里的“异常”指一种会打断当前代码块正常控制流的对象事件；解释器检测到运行时错误时可以引发异常，程序也可以用 `raise` 主动引发异常。异常不是错误消息文本：一次异常由异常实例表示，实例的类表达可供程序匹配的失败类别，实例可以携带具体信息，抛出时还会关联 traceback。traceback 是记录异常沿哪些执行现场传播的诊断对象，默认未处理异常报告会利用它显示调用路径。[Python Execution Model: Exceptions][python-exceptions-model][Python Built-in Exceptions][python-built-in-exceptions] 语法错误发生在一份待编译源码无法按语法规则形成可执行代码时，这份源码本身尚未开始执行；`SyntaxError` 同时也是异常层级中的一个类，因此动态编译或导入代码的调用方仍可能把这类失败作为异常对象接收。本章的中心是代码开始执行以后，异常如何改变控制流以及清理如何跨越这种改变。

“资源”指不能只靠普通对象值是否仍被使用来决定生命周期的外部能力或需要成对恢复的运行时状态，例如打开的文件、持有的锁或临时切换的执行环境；“资源边界”指取得或进入已经成功之后，到释放或退出必须完成之前的那段代码范围。只在正常路径末尾手写 `close()` 或恢复语句，会在异常、`return`、`break` 或 `continue` 提前离开时漏掉清理。把清理交给对象变得不可达后的垃圾回收也不是 Python 语言保证：实现可以推迟甚至省略垃圾回收，CPython 常见的及时引用计数行为不能被当成跨实现的资源释放契约。[Python Data Model: Objects, values and types][python-data-model]

失败传递有几条共同的候选路线。立即终止程序最简单，却不给调用者恢复、转换或补充上下文的机会；返回错误码、哨兵值或“结果/错误”组合会让失败显式进入普通数据流，却占用正常返回通道，并要求每一层调用者都检查和继续转发，否则失败会被误当成有效结果；执行前先检查条件能挡住一部分预期分支，却无法消除检查之后、实际操作之前状态再次变化的可能，也无法预先枚举任意被调用函数内部的失败；异常则建立一条独立于普通返回值的控制流通道，让检测点产生带类型的信息，让不具备处理能力的中间函数停止当前路径并继续向外传播，让有处理能力的边界选择性接住。Python 选择异常作为运行时失败的通用语言机制，但没有取消普通条件分支或显式结果值；能够当场预期和决定的分支仍适合用 `if` 或返回值，不能在当前层完成正常契约的情况才适合引发异常。

Python 采用“终止模型”：异常在检测点被引发后，当前操作不会从失败位置修好并原地重试；当前 suite 的剩余语句被跳过，解释器从直接包围它的处理器开始，沿动态调用链向外寻找能够匹配的处理器，处理器若决定重试，只能重新执行相应操作或重新进入那段代码。[Python Execution Model: Exceptions][python-exceptions-model] `try` 标出可能离开正常路径的最小 suite，`except` 按书写顺序检查异常实例的类：`except E` 匹配类为 `E` 或从 `E` 真实继承的异常实例，第一个匹配分句执行，其余同级处理器不再执行；多个类别可以写入元组，如 `except (E1, E2):`，但它们应当确实需要同一种恢复动作；没有匹配项时，异常继续向外传播。`except E as err` 还会把异常实例临时绑定到名字 `err`，处理器结束时该名字会被清除，以断开异常、traceback、执行现场与局部名字可能形成的引用环。[Python Language Reference: try statement][python-try]

异常层级让处理范围既能精确也能概括。`BaseException` 是所有异常的共同基类；`Exception` 是通常不表示系统退出的内置异常和用户异常的共同基类，所以 `except Exception:` 会捕获大多数应用错误，却通常让 `KeyboardInterrupt` 与 `SystemExit` 继续传播。无表达式的裸 `except:` 连这类退出信号也会接住，只适合极少数必须观察后立即重新抛出或执行兜底清理的边界。[PEP 352: Required Superclass for Exceptions][pep352][PEP 8: Programming Recommendations][pep8-errors] 处理范围必须和真正能够采取的动作一致：捕获过宽、空处理器或一律返回默认值会把程序错误伪装成成功；把过多语句放入 `try`，又会让同一种异常类型在非预期位置出现时被错误处理。

`try` 的 `else` 分句用于表达“受保护操作正常完成以后才执行，而且这里的新异常不交给前面的处理器”。它只有在 `try` suite 没有引发异常，也没有通过 `return`、`break` 或 `continue` 提前离开时执行；`else` 中引发的异常不会被同一条 `try` 前面的 `except` 捕获。[Python Language Reference: try statement][python-try] 因此，`else` 不是可有可无的外观：它能把真正可能产生预期异常的语句限制在尽量小的 `try` 中，把成功后的计算移出捕获范围，避免一个本应暴露的新缺陷碰巧具有相同异常类型而被误认为预期失败。

`raise` 让函数主动声明“当前正常契约无法继续”。带表达式的 `raise` 接受 `BaseException` 的实例或子类；给出类时，Python 会在需要时无参数实例化它。无表达式的 `raise` 重新引发当前正在处理的活动异常；如果此时没有活动异常，则产生 `RuntimeError`。[Python Language Reference: raise statement][python-raise] 处理器在转换抽象层时可以写 `raise HigherLevelError(...) from err`，把原异常设为新异常的显式原因；在处理异常期间意外产生的新异常则会自动保留为上下文。异常链解决“对外换成合适失败类型”和“不能丢掉原始原因”之间的冲突；`from None` 可以隐藏默认展示的隐式上下文，却不应被用来抹掉诊断所需的信息。[PEP 3134: Exception Chaining and Embedded Tracebacks][pep3134] 异常消息面向人类诊断，不是稳定的程序接口；分支判断应依赖异常类型和明确属性，而不是匹配消息文本。[Python Execution Model: Exceptions][python-exceptions-model]

处理失败和保证清理是两种责任。`except` 决定某类异常是否能在此处转化为新的正常路径；`finally` 不负责证明失败已经恢复，而是在 `try`、`except` 或 `else` 通过正常完成、异常、`return`、`break`、`continue` 离开时都执行退出动作。尚未处理的异常会先被保存，`finally` 完成后再继续传播；若 `finally` 自己引发新异常，原异常成为新异常的上下文；若 `finally` 用 `return`、`break` 或 `continue` 离开，原先保存的异常或返回动作会被丢弃或覆盖。这个行为会隐藏真正失败，Python 3.14 起会对从 `finally` 块退出的这三种控制流语句发出 `SyntaxWarning`。[Python Language Reference: try statement][python-try][PEP 765: Disallow return/break/continue that exit a finally block][pep765]

`try` / `finally` 能表达可靠的取得—释放配对，但每一种文件、锁或临时状态都让调用方重复这套模板，会把资源协议散落到业务流程里。`with` 的引入正是为了把标准 `try` / `finally` 用法封装成可复用协议。[PEP 343: The with statement][pep343] “上下文管理器”是定义一段运行时环境如何进入和退出的对象；`with` 先求值上下文表达式得到管理器，调用它的 `__enter__()` 进入环境，并把 `__enter__()` 的返回值而不一定是管理器本身绑定到 `as` 后的目标，然后执行 suite，最后调用 `__exit__()` 退出环境。[Python Data Model: Context managers][python-context-managers][Python Language Reference: with statement][python-with]

`with` 的保证有精确边界：只有 `__enter__()` 已经成功返回，后续才保证调用对应的 `__exit__()`；这个保证连 `as` 目标绑定本身失败的路径也覆盖。若 `__enter__()` 自身失败，该管理器尚未完成进入，Python 不会调用它的 `__exit__()`。suite 因异常退出时，异常类型、异常实例和 traceback 会传给 `__exit__()`；它返回假值时，原异常继续传播，返回真值时，异常被明确抑制。suite 正常完成，或通过 `return`、`break`、`continue` 离开时，`__exit__()` 仍会执行，但其返回值不再决定这些控制流是否继续。多个上下文管理器按嵌套语义从左到右进入、从右到左退出；后一个管理器进入失败时，已经成功进入的前置管理器仍会退出。[Python Language Reference: with statement][python-with] 因此，`with` 不只是“自动关闭文件”的缩写，而是把进入成功后的退出义务绑定到一个可见 suite；代价是退出逻辑可以抑制异常，也可能在退出失败时产生新异常，调用者必须理解所用管理器的协议。

这套机制最常见的失败模式都来自边界错位：把异常当普通分支会用控制流跳转代替清楚条件；把普通缺省结果当异常会让调用方无法区分“没有值”和“执行失败”；捕获 `Exception` 后静默继续会破坏失败可见性；处理器顺序把父类放在子类之前会遮住更精确的分支；省略 `else` 并扩大 `try` 会误捕获成功后代码的缺陷；`raise err` 会把当前 `raise` 语句再加入 traceback，而处理器中的裸 `raise` 才是保留原传播记录的直接重新抛出；`finally` 中返回会覆盖结果或异常；假设 `with ... as x` 中的 `x` 必然是管理器对象会误读 `__enter__()` 的返回契约；依赖 CPython 引用计数代替 `with` 会把实现习惯误写成语言保证；不了解 `__exit__()` 的真值语义则可能让失败被无声吞掉。

Python、Java 和 C++ 都必须处理失败传播与资源释放，差异在于它们把保证放在哪一层。Java 同样使用异常、`catch` 和 `finally`，并用 `try`-with-resources 约束实现资源接口的对象；关闭期间的新异常会进入主要异常的 suppressed exception 列表。[Java Language Specification: try-with-resources][jls-try-resources] C++ 在异常展开栈时销毁已经构造、尚未销毁的自动存储期对象，资源管理通常由对象生命周期与析构函数形成 RAII 边界。[C++ Draft: Stack unwinding][cpp-stack-unwinding] Python 没有 Java 的受检异常声明，也不把普通局部变量离开词法作用域等同于 C++ 的确定析构；它以动态异常类匹配负责失败传播，以显式 `finally` 和上下文管理协议负责清理，并允许任何遵守协议的对象定义 `with` suite 前后的运行时环境。

本章范围保持在单个同步控制流中的一个主要异常及其因果链。`ExceptionGroup` 与 `except*` 处理多个彼此独立的并发失败，需要另一套“拆分后分别匹配再合并传播”的模型；`async with` 还要把进入和退出变成可等待操作；二者都不并入当前控制流链。自定义异常类建立在第 06 章的类和实例、第 09 章的继承关系之上，`with` 则把第 10 章的一般对象协议具体化为 `__enter__()` 与 `__exit__()`；文件编码、文本与字节接到第 19 章，异常报告、日志和配置接到第 23 章。本章只保留它们在当前边界中的必要事实：异常是带类型和因果信息的运行时对象，`try` / `except` / `else` 决定传播与恢复边界，`raise` 产生、重抛或转换失败，`finally` 保证退出动作，`with` 把可复用的进入—退出协议固定到一个 suite。

最小练习使用一个读取单个整数的极小函数与一个调用者：文件打开成功后由 `with` 保证关闭，文本转整数可能引发 `ValueError`，文件取得可能引发 `OSError`，底层异常在函数边界用 `raise ... from ...` 转换，调用者只处理自己真正能恢复的类型。练习分别制造正常完成、取得资源失败、使用资源失败、成功后代码失败和清理阶段失败，逐次判断哪条语句没有执行、哪个 `except` 匹配、`else` 是否进入、`finally` 何时执行、`__exit__()` 收到什么、原异常是否继续传播。判断能够完整覆盖这些路径，才说明错误处理不再是“给代码包一层 `try`”，而是为正常结果、失败传播、诊断因果和资源生命周期分别划出了边界。

## Sources

- [Python Tutorial: Errors and Exceptions][python-errors]
- [Python Execution Model: Exceptions][python-exceptions-model]
- [Python Language Reference: try statement][python-try]
- [Python Language Reference: with statement][python-with]
- [Python Language Reference: raise statement][python-raise]
- [Python Data Model: Objects, values and types][python-data-model]
- [Python Data Model: Context managers][python-context-managers]
- [Python Built-in Exceptions][python-built-in-exceptions]
- [PEP 8: Programming Recommendations][pep8-errors]
- [PEP 343: The with statement][pep343]
- [PEP 352: Required Superclass for Exceptions][pep352]
- [PEP 3134: Exception Chaining and Embedded Tracebacks][pep3134]
- [PEP 765: Disallow return/break/continue that exit a finally block][pep765]
- [Java Language Specification: try-with-resources][jls-try-resources]
- [C++ Draft: Stack unwinding][cpp-stack-unwinding]

[python-errors]: https://docs.python.org/3/tutorial/errors.html
[python-exceptions-model]: https://docs.python.org/3/reference/executionmodel.html#exceptions
[python-try]: https://docs.python.org/3/reference/compound_stmts.html#the-try-statement
[python-with]: https://docs.python.org/3/reference/compound_stmts.html#the-with-statement
[python-raise]: https://docs.python.org/3/reference/simple_stmts.html#the-raise-statement
[python-data-model]: https://docs.python.org/3/reference/datamodel.html#objects-values-and-types
[python-context-managers]: https://docs.python.org/3/reference/datamodel.html#with-statement-context-managers
[python-built-in-exceptions]: https://docs.python.org/3/library/exceptions.html
[pep8-errors]: https://peps.python.org/pep-0008/#programming-recommendations
[pep343]: https://peps.python.org/pep-0343/
[pep352]: https://peps.python.org/pep-0352/
[pep3134]: https://peps.python.org/pep-3134/
[pep765]: https://peps.python.org/pep-0765/
[jls-try-resources]: https://docs.oracle.com/javase/specs/jls/se26/html/jls-14.html#jls-14.20.3
[cpp-stack-unwinding]: https://eel.is/c++draft/except.ctor
