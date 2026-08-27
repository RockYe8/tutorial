# 04. Python 为什么用模块、包和导入规则组织多文件程序？

## 本章推理总览

第 01 章已经建立了 Python 的运行链：源码执行后产生对象，名字把对象接入命名空间，模块把文件级命名空间变成可导入复用的单元，`__main__` 区分入口运行和导入复用。第 02 章说明，多个对象可以通过 `list`、`tuple`、`dict`、`set` 形成顺序、固定组合、键值映射和唯一成员。第 03 章说明，行为可以被 `def` 包装成函数对象，通过参数、返回值和局部命名空间从顶层流程中抽出来。程序拥有对象、对象关系和可复用行为之后，新的压力来自规模增长：函数、容器、常量和入口流程不能长期挤在一个文件的顶层命名空间里。Python 官方模块教程把这个压力说得很直接：程序变长时，为了更容易维护，也为了在多个程序里复用已经写好的函数而不复制定义，可以把定义放进文件并导入使用。[Python Tutorial: Modules][python-modules]

处理多文件程序可以走几条路线：继续保留单文件，用最低启动成本换取越来越拥挤的顶层名字；复制粘贴常用函数，用短期便利换取规则分叉；依赖全局共享状态、环境变量、文本协议或框架约定，让文件之间隐式通信；或者让每个可复用文件形成独立模块命名空间，再用导入规则明确当前文件拿到哪个边界里的哪个对象。Python 选择第四条作为普通多文件程序的中心路线：模块不是语法标签，而是代码被导入系统找到、加载、执行后形成的运行时模块对象。[Python Import System][python-import-system]

模块延续第 01 章的对象和命名空间模型。导入一个模块时，Python 会搜索模块、创建并初始化目标模块对象、执行模块顶层代码来填充模块命名空间；随后，具体导入形式决定把模块对象、包对象、子模块对象，或模块中的某个对象绑定到当前作用域中的名字。顶层执行产生的名字留在模块自己的命名空间中；顶层 `def` 会创建函数对象并绑定函数名，但函数体要等调用时才执行。导入语句之间的差异，本质上不是“语法形状不同”，而是当前命名空间获得的绑定不同：有的绑定模块对象，有的绑定模块中的对象，有的给同一个对象换一个当前名字。模块边界因此由三件事共同形成：模块对象、模块自己的命名空间、当前命名空间中的导入绑定。

这里的边界，指名字、职责、依赖和复用接口的归属范围；包把这个边界从单个模块扩大到多个相关模块。模块是可被导入的代码单元，包是一种特殊模块；它同样是模块对象、同样拥有命名空间，但还能包含子模块或子包。Python 官方教程把包描述为使用点分模块名来组织模块命名空间的方法；点分模块名中的 `.` 表达归属层级，例如 `catalog.pricing` 表示 `catalog` 包里的 `pricing` 模块。[Python Tutorial: Packages][python-modules] 常规源码包通常由带 `__init__.py` 的目录形成；运行时更关键的判断是包模块对象拥有 `__path__`，导入系统用它继续搜索子模块。[Python Import System: Packages][python-import-system] 因此，包边界不是文件夹审美，而是相关模块共享命名空间、表达依赖方向和暴露复用接口的机制。

导入规则的核心取舍是显式边界和运行时复用之间的平衡。Python 没有要求所有多文件结构先通过编译器、链接器或构建系统静态固定；它允许模块在运行时被搜索、执行、缓存和绑定。`sys.modules` 缓存保存“模块名字符串 -> 模块对象”的映射；导入系统会先检查这个缓存，已导入模块通常直接复用同一个模块对象，未命中时才继续搜索和加载。[Python Import System: Module Cache][python-import-system] 这个机制避免每次 `import` 都重新执行同一模块顶层代码，也让同一个模块对象能被多个地方引用；代价是导入顺序、循环导入、模块搜索路径和顶层副作用都会影响程序行为。

入口运行和导入复用把第 01 章的 `__main__` 与第 03 章的 `main()` 接在一起。同一个文件既可能作为入口运行，也可能作为模块被导入。`__name__` 是模块命名空间里的特殊名字；普通导入时通常绑定到模块名，作为入口运行时绑定到 `"__main__"`。因此，`if __name__ == "__main__":` 可以把命令行解析、打印、文件读写等一次性流程限制在入口运行中，而可复用函数仍然可以被导入、测试和组合。[Python Tutorial: Executing Modules as Scripts][python-modules]

这条路线的失败模式都来自边界混淆：把模块当复制粘贴工具，会让规则分叉；把 `import` 当成把所有名字倒进当前文件，会削弱可读性并可能遮住已有绑定；把模块顶层写成入口流程，会让导入带来意外副作用；忽略导入缓存，会误判源码修改和内存中旧模块对象的关系；按文件夹外观拆包而不按命名空间、依赖方向和复用接口拆包，会形成循环导入和难以测试的文件关系。

回看前三章，模块和包不是新的孤立主题，而是把已有机制扩大到多文件尺度。第 01 章的对象、名字、命名空间变成模块对象、模块全局命名空间和导入绑定；第 02 章的容器和数据结构会被模块暴露为配置、样例数据、注册表或测试时使用的固定样例数据；第 03 章的函数对象成为模块最常见的可复用出口。模块、包和导入规则共同回答同一个问题：当对象、容器和函数继续增长，Python 如何用命名空间隔离名字，用导入绑定复用对象，用包边界组织相关模块，用入口身份把一次运行和长期复用分开。

## 本章证据底座

本章关于模块、包、导入形式、模块搜索路径、`from module import *` 和 `__name__` 的用户层机制，主要来自 Python 官方教程的 Modules 章节。官方教程明确说明，模块是包含 Python 定义和语句的文件，文件名通常是模块名加 `.py` 后缀；程序变长时，可以把定义放进模块并导入复用；模块有自己的私有命名空间；包用点分模块名组织模块命名空间。[Python Tutorial: Modules][python-modules]

本章关于导入系统、模块对象、`sys.modules`、包与 `__path__` 的语言层边界，来自 Python Language Reference 的 import system。语言参考说明，导入语句结合了两步操作：先搜索模块，必要时创建并初始化模块；然后在当前作用域中为导入语句指定的对象定义名字。它也说明 `sys.modules` 是模块名到已加载模块的缓存，包是一种可以包含子模块的模块。[Python Import System][python-import-system]

本章关于名字绑定、作用域和命名空间的解释，延续 Python Execution Model。执行模型说明，名字由绑定操作引入，`import` 语句也是名字绑定操作之一；模块、函数体和交互输入都是代码块，名字查找需要放回作用域和命名空间规则中理解。[Python Execution Model][python-execution-model][Python Execution Model: Naming and binding][python-naming]

“模块、包和导入规则把对象、容器、函数扩大到多文件尺度”是本教程综合归纳，不是 Python 官方给出的固定术语。

## 从单文件程序到多文件程序

前三章已经把一个小程序最重要的三类运行时东西摆出来了：

```text
对象
  运行后真正存在、能被引用和组合的实体。

容器
  保存多个对象引用，并表达顺序、固定组合、键值映射和唯一成员。

函数
  把行为包装成函数对象，使行为能被命名、调用、测试、传递和导入。
```

这些机制足以写出清楚的小脚本：

```python
products = [
    {"sku": "tea", "cents": 1299, "tags": {"drink", "warm"}},
    {"sku": "cup", "cents": 899, "tags": {"tool", "kitchen"}},
]

def total_cents(items):
    total = 0
    for product in items:
        total = total + product["cents"]
    return total

def format_price(cents):
    return f"${cents / 100:.2f}"

def main():
    amount = total_cents(products)
    print(format_price(amount))

if __name__ == "__main__":
    main()
```

这个文件仍然可以读懂，因为名字不多，行为不多，入口流程也很短。继续增长后，压力会变化：商品数据可能越来越多，价格规则可能加入折扣和税费，格式化规则可能支持多种货币，入口流程可能要解析命令行参数，测试还需要固定样例数据。所有名字继续写在同一个模块顶层，读者就要在同一张名字表里区分数据、计算、显示、入口和测试辅助。

问题不在于 Python 不能运行一个很长的文件。问题在于，一个文件只有一个模块级命名空间。这个命名空间里的名字越多，边界越弱，复用越容易牵连入口流程，测试也越难只拿到某个函数或某组数据。

模块回应了这组压力。它让一个文件承载一组相互相关的顶层名字，并把这组名字放进独立的模块命名空间。其他代码通过导入使用这组名字，而不是复制源码或共享一堆无边界的全局状态。

## 几条可选路线

第一条路线是把所有代码继续放进一个文件：

```text
catalog_functions.py
  PRODUCTS
  TAX_RATE
  total_cents
  apply_discount
  format_price
  print_catalog
  main
  临时调试代码
```

它的优势是简单：一个文件就能打开、运行、修改。代价是边界会随着增长变模糊。`main()` 需要的临时流程和可复用函数在同一层；给测试准备的固定样例数据和程序运行时的数据也在同一层；一个名字到底是模块对外接口，还是当前文件内部细节，只能靠读者猜。

第二条路线是复制粘贴函数。`format_price()` 在一个脚本里好用，就复制到另一个脚本；`total_cents()` 在测试里需要，也再复制一份。这条路线短期最省力，长期最容易分叉。价格格式规则一改，三个文件里的三个副本可能只改了两个；测试覆盖其中一个副本，并不能证明另一个副本仍然正确。

第三条路线是让文件之间通过隐式共享状态配合。例如把数据写进环境变量、临时文本文件、全局注册表，或者让某个入口脚本在运行时悄悄准备一堆名字，别的文件再依赖这些名字已经存在。这种做法能让文件之间“联系起来”，但边界更难看见。读一个函数时，还要猜它依赖哪个入口脚本先运行过、哪个全局状态已经被设置、哪个文本格式没有被破坏。

第四条路线是把相关名字放进模块，让模块成为可导入的边界：

```text
catalog/
  data.py
  pricing.py
  formatting.py
  cli.py
```

`data.py` 保存商品样例或数据构造函数；`pricing.py` 保存价格计算；`formatting.py` 保存展示格式化；`cli.py` 组织一次命令行运行。每个文件执行后都有自己的模块命名空间，导入者从模块名上看出对象和行为来自哪里。

Python 选择这条路线作为普通多文件程序的中心。它保留了脚本的低启动成本：一个 `.py` 文件仍然可以直接运行；同时也提供了程序增长所需的边界：一个 `.py` 文件可以作为模块被导入，多个模块可以被包组织到共同命名空间之下。

## 模块不是文件名的标签，而是运行后的对象

官方教程用一个直接的定义开始：模块是包含 Python 定义和语句的文件，文件名通常是模块名加 `.py` 后缀。[Python Tutorial: Modules][python-modules] 这说明了普通源码模块的常见承载形式，但概念上不能把模块直接等同于文件。文件是磁盘上的代码来源；模块是导入系统在运行时创建或复用的模块对象，以及这个对象承载的模块命名空间、缓存记录和导入绑定。

因此，判断顺序不是“看到 `.py` 文件，它天然就是模块”，而是：

```text
导入系统能否按某个模块名找到代码来源
-> 能否创建或复用一个模块对象
-> 能否执行或初始化这个对象的模块命名空间
-> 能否把这个模块对象登记到 sys.modules 并绑定到当前命名空间
```

常见的源码模块来源是 `.py` 文件：

```text
pricing.py
```

对应模块名：

```text
pricing
```

然后可以导入：

```python
import pricing
```

`pricing.py` 不需要写一个关键字声明“这是模块”。文件能被导入系统按模块名找到，并按模块规则加载，它就在这次运行中形成模块对象。这个运行时对象才是 Python 程序后续能缓存、引用、传递和访问属性的模块。

这种定义也解释了为什么不能把模块压成“`.py` 文件”这个文件系统概念。导入系统寻找的是模块名对应的代码来源或已存在模块对象；来源可以不同，但运行时模型保持一致：

```text
源码模块
  常见来源是 .py 文件，例如 pricing.py。
  导入后形成普通模块对象，执行源码填充模块命名空间。

内置模块
  由 Python 实现预先提供，例如 sys。
  它不需要对应当前项目里的 sys.py 文件，导入后仍表现为模块对象。

扩展模块
  通常来自编译产物，例如 Windows 上的 .pyd 或 Unix-like 系统上的 .so。
  它不是普通 Python 源码文件，但导入后仍向 Python 暴露模块对象和模块命名空间。

zip 中的模块
  代码来源可以在 zip 归档里。
  导入系统只要有相应查找和加载能力，仍可以按模块名加载它。

namespace package
  包可以没有单个 __init__.py 作为初始化文件。
  只要导入系统为它建立带 __path__ 的包模块对象，它仍然是包。
```

这些形态的差异发生在“导入系统从哪里取得代码或模块定义”这一层；它们进入 Python 程序后，都要回到同一条运行时链路：

```text
模块名
-> 查找或取得模块来源
-> 创建或复用模块对象
-> 初始化模块命名空间
-> 登记到 sys.modules
-> 在当前命名空间写入导入绑定
```

导入时发生的事情可以接回第 01 章的运行模型：

```text
导入系统找到 pricing.py
-> 创建并初始化 pricing 模块对象
-> 执行 pricing.py 的顶层代码
-> 顶层赋值、def、class、import 等语句把名字写入 pricing 的模块命名空间
-> 当前作用域绑定导入结果
```

例如 `pricing.py`：

```python
TAX_RATE = 0.08

def total_cents(items):
    total = 0
    for product in items:
        total = total + product["cents"]
    return total
```

第一次导入：

```python
import pricing
```

可以理解成形成两层名字表：

```text
当前模块命名空间
  pricing -> pricing 模块对象

pricing 模块命名空间
  TAX_RATE -> float 对象 0.08
  total_cents -> 函数对象
```

`pricing` 是当前文件里的名字。它绑定到模块对象。`TAX_RATE` 和 `total_cents` 是 `pricing` 模块命名空间里的名字。使用：

```python
pricing.total_cents(products)
```

就是先通过当前命名空间里的名字 `pricing` 找到模块对象，再从这个模块对象承载的命名空间中找到 `total_cents` 函数对象，然后调用它。

## 顶层 `def` 会执行，函数体不会随导入执行

模块导入会执行模块顶层语句。这个事实容易带来一个误解：既然导入会执行模块，模块里的函数体是不是也会跟着执行？

写在模块最外层的 `def` 本身是顶层语句；它会在模块导入时执行。但 `def` 的执行结果是创建函数对象，并把函数名绑定到模块命名空间。`def` 下面缩进的函数体是函数对象保存的代码，要等函数对象被调用时才运行。

示例：

```python
print("module top")

def total_cents(items):
    print("inside total_cents")
    return sum(product["cents"] for product in items)

print("module bottom")
```

导入这个模块时会执行顶层 `print` 和顶层 `def`：

```text
module top
module bottom
```

不会输出：

```text
inside total_cents
```

因为函数体还没有被调用。调用发生在之后：

```python
pricing.total_cents([{"cents": 100}])
```

这时才进入函数体，创建本次函数调用的局部命名空间，并执行函数体代码。

这一点正好接住第 03 章。函数对象的意义就是把一段行为包装起来，留到需要时再运行。如果 `def` 一出现就执行函数体，函数就无法承担可复用行为的边界；导入模块也会变得危险，因为导入一个工具函数就可能立刻触发计算、打印、文件读写或网络请求。

`def` 是可执行语句，这一点不要求它必须写在文件最左侧。只要某条 `def` 语句在模块顶层执行过程中被走到，它就会创建函数对象，并把函数名绑定到模块命名空间。

```python
USE_DISCOUNT = True

if USE_DISCOUNT:
    def total_cents(items):
        return sum(product["cents"] for product in items) * 90 // 100
else:
    def total_cents(items):
        return sum(product["cents"] for product in items)
```

这个模块被导入时，`if` 是模块顶层语句，会在导入过程中执行。若 `USE_DISCOUNT` 为 `True`，第一个 `def total_cents` 被执行，模块命名空间得到一个 `total_cents` 绑定；`else` 分支没有被走到，第二个函数对象不会创建。若条件相反，模块命名空间仍然得到名为 `total_cents` 的绑定，只是它指向另一个函数对象。

不同名字的 `def` 也遵守同一条规则：执行到几条 `def`，就创建几个函数对象，并把对应函数名写入当前命名空间。

```python
if USE_DISCOUNT:
    def price_with_discount(cents):
        return cents * 90 // 100

    def price_without_discount(cents):
        return cents
```

若这个分支被执行，两条 `def` 都会执行，模块命名空间中会同时出现两个绑定：

```text
price_with_discount    -> 函数对象
price_without_discount -> 函数对象
```

若两个不同名字的 `def` 分别位于互斥分支中，导入时只会执行其中一个分支，模块命名空间也只会得到被执行分支里的名字。模块命名空间记录的是运行路径真正执行出来的绑定，而不是源码中所有可能出现的函数名清单。

## 导入绑定的是当前命名空间里的名字

Python Language Reference 把导入语句拆成两步：先搜索、加载并初始化模块；然后在当前作用域中定义一个或多个名字。[Python Import System][python-import-system] 第二步非常重要，因为不同导入形式的主要差异经常不在于加载了哪个模块对象，而在于当前命名空间最后新增了哪些名字绑定。

普通导入：

```python
import pricing
```

当前命名空间新增：

```text
pricing -> pricing 模块对象
```

模块内部的函数名和常量名仍然留在 `pricing` 自己的模块命名空间中：

```python
pricing.total_cents(products)
pricing.TAX_RATE
```

从模块导入某个名字：

```python
from pricing import total_cents
```

当前命名空间新增：

```text
total_cents -> pricing 模块命名空间里的函数对象
```

这不会自动新增：

```text
pricing -> pricing 模块对象
```

所以当前代码可以直接调用：

```python
total_cents(products)
```

但不能因此假设 `pricing` 这个名字已经存在。

别名导入只是改变当前命名空间里的名字：

```python
import pricing as p
```

当前命名空间新增：

```text
p -> pricing 模块对象
```

模块对象仍然是那个模块对象，只是当前代码用 `p` 这个本地名字找到它。

包中的子模块更能看出“加载对象”和“绑定名字”的区别：

```python
import catalog.pricing
```

当前命名空间通常从顶层包名进入：

```text
catalog -> catalog 包模块对象
```

使用时写：

```python
catalog.pricing.total_cents(products)
```

而：

```python
import catalog.pricing as pricing
```

当前命名空间新增：

```text
pricing -> catalog.pricing 模块对象
```

使用时写：

```python
pricing.total_cents(products)
```

这两种写法可以加载或复用同一个 `catalog.pricing` 模块对象。不同的是当前命名空间里的入口名字：一个是 `catalog`，一个是 `pricing`。

## `from module import *` 为什么削弱边界

星号导入的问题不是“导入模块”这件事本身不可取，而是它把对方模块中可导出的多个顶层名字直接绑定进当前命名空间。

假设 `pricing.py` 是：

```python
TAX_RATE = 0.08
DEFAULT_CURRENCY = "USD"

def total_cents(items):
    return sum(product["cents"] for product in items)

def format_price(cents):
    return f"${cents / 100:.2f}"
```

执行：

```python
from pricing import *
```

当前命名空间会得到类似：

```text
TAX_RATE -> float 对象
DEFAULT_CURRENCY -> str 对象
total_cents -> 函数对象
format_price -> 函数对象
```

通常不会新增：

```text
pricing -> pricing 模块对象
```

于是后续代码变成：

```python
amount = total_cents(products)
text = format_price(amount)
```

这段代码可以运行，但读者不容易从名字上看出 `total_cents` 和 `format_price` 来自 `pricing` 模块，还是当前文件自己定义的函数。若当前文件原本也有同名名字，星号导入还可能遮住已有绑定。

官方教程说明，`from module import *` 会导入不以下划线开头的名字，并且通常不推荐这种做法，因为它会引入未知名字集合，可能隐藏已经定义的东西，也会造成可读性差的代码。[Python Tutorial: Modules][python-modules]

“不以下划线开头”接着 Python 对公开接口的命名约定。模块会暴露许多顶层名字，但并不是所有名字都希望外部代码依赖；Python 通常不靠严格的 `private` 关键字封死访问，而是用名字表达边界强弱。单下划线开头的名字，例如 `_round_cents`，通常表示模块内部使用的实现细节。它仍然可以被 `pricing._round_cents` 访问，但外部代码不应把它当作稳定接口；星号导入默认也会尊重这个约定，不把这类名字倒进当前命名空间。

模块如果要更明确地声明星号导入时的公开名字集合，可以定义 `__all__`。在普通模块中，`__all__` 通常写在这个模块文件本身：

```python
__all__ = ["TAX_RATE", "format_price", "total_cents"]
```

这样 `from pricing import *` 只会导入 `pricing.py` 中 `__all__` 列出的名字。

包也可以在自己的 `__init__.py` 中定义 `__all__`。例如 `catalog/__init__.py` 可以先从子模块中挑出少量想放到包表面的名字，再声明包级公开集合：

```python
from catalog.formatting import format_price
from catalog.pricing import total_cents

__all__ = ["format_price", "total_cents"]
```

此时 `from catalog import *` 导入的是 `catalog` 包表面声明的名字。也就是说，模块级 `__all__` 写在 `module.py` 里，控制 `from module import *`；包级 `__all__` 写在 `package/__init__.py` 里，控制 `from package import *`。日常代码仍然更推荐显式导入，例如 `from catalog.pricing import total_cents`，因为它直接保留了名字来源。更完整的命名约定还包括类中的双下划线名字和前后双下划线的特殊协议名字；它们都服务“名字如何表达边界和协议”这个问题，但属于后续专门讨论公开接口、内部细节和命名约定的章节。

普通导入保留了模块边界：

```python
import pricing

amount = pricing.total_cents(products)
text = pricing.format_price(amount)
```

多写的 `pricing.` 同时给出一个边界信号：这些行为来自价格模块，不是当前文件的局部逻辑。

## 包把多个模块放进共同命名空间

模块解决单个运行时模块对象内部的名字边界。包解决多个相关模块之间的归属边界。这里的“边界”不是物理隔墙，而是一组运行时和工程上的归属关系：哪些名字属于这个模块，哪些职责放在这个模块，其他模块应该沿什么方向依赖它，外部代码应该通过哪些稳定名字复用它。

和模块不能简单等同于文件一样，包也不能简单等同于文件夹。文件夹是常见承载形式；包的本体是导入系统创建或复用的包模块对象。它同样有模块命名空间，同时还带有让导入系统继续寻找子模块的搜索边界。

普通模块的命名关系如下：

```text
pricing.py
```

模块名通常是：

```text
pricing
```

再看包里的模块：

```text
catalog/
  __init__.py
  pricing.py
  formatting.py
```

`catalog` 是包，`catalog.pricing` 是包里的子模块，`catalog.formatting` 是另一个子模块。

“点分模块名”里的点就是 `.`：

```text
catalog.pricing
```

可以读成：

```text
catalog 包里的 pricing 模块
```

Python 官方教程说，包用点分模块名组织模块命名空间；`A.B` 表示包 `A` 中名为 `B` 的子模块。[Python Tutorial: Packages][python-modules] 这个点不是普通文件路径分隔符，而是 Python 模块命名系统中的层级分隔符。它通常和文件系统有对应关系：

```text
catalog.pricing
  对应 catalog/pricing.py
```

从命名空间层级看：

```text
catalog
  给一组相关模块一个共同边界。

pricing
  是这个边界里负责价格逻辑的子模块。
```

这个共同边界同时作用在几个层面。命名边界让外部代码从 `catalog.` 看出这些模块属于同一组程序能力；职责边界让 `catalog.pricing` 承担价格计算，`catalog.formatting` 承担展示格式化，`catalog.cli` 承担入口流程；依赖边界让入口模块依赖底层计算模块，而不是让价格计算反向依赖命令行入口；复用接口边界让外部代码通过清楚的模块名和函数名使用功能，而不是伸进每个文件的临时实现细节。

包和模块不是两个互不相干的东西。包是一种特殊的模块：它导入后也是模块对象，也有自己的模块命名空间，但它还能包含子模块或子包。导入系统参考用运行时属性刻画这点：有 `__path__` 属性的模块被认为是包。[Python Import System: Packages][python-import-system]

普通项目最常见的包写法是目录里放 `__init__.py`：

```text
catalog/
  __init__.py
  pricing.py
```

`__init__.py` 可以是空文件，也可以放少量包初始化代码。官方教程说明，`__init__.py` 使 Python 把目录当作常规包；同时，Python 也支持没有 `__init__.py` 的 namespace package。[Python Tutorial: Packages][python-modules] 这两个事实共同说明：`__init__.py` 是常规包的常见文件系统标记和初始化来源，不是“包”这个概念的本体。包的运行时判据仍然要回到模块对象是否拥有 `__path__`。

从运行时看，关键不是程序员通常去手写 `__path__`，而是导入系统给包模块对象设置 `__path__`。这个属性记录后续搜索子模块的位置。导入：

```python
import catalog.pricing
```

时，Python 需要先找到 `catalog` 包，再沿着 `catalog.__path__` 去寻找 `pricing` 子模块。`__path__` 因此不是普通业务变量，而是导入系统让“这个模块还能包含子模块”成立的运行时搜索边界。无论包和子模块的来源形态如何变化，进入 Python 程序后仍要落到模块对象、模块命名空间、`sys.modules` 缓存和当前命名空间绑定这套模型上。

## `sys.modules` 缓存的是模块对象，不是源码文件的实时镜像

导入模块不是每次都重新执行模块文件。官方教程说明，为了效率，每个模块在一次解释器会话中只导入一次；如果改了模块，需要重启解释器，或者在交互测试某个模块时使用 `importlib.reload()`。[Python Tutorial: Modules][python-modules]

语言参考把这个机制放在 `sys.modules` 中。`sys.modules` 是一个映射：

```text
模块名字符串 -> 模块对象
```

第一次导入：

```python
import pricing
```

大致发生：

```text
sys.modules 中没有 "pricing"
-> 搜索 pricing.py
-> 创建 pricing 模块对象
-> 执行 pricing.py 顶层代码，填充模块命名空间
-> sys.modules["pricing"] = pricing 模块对象
-> 当前命名空间绑定 pricing
```

第二次导入：

```python
import pricing
```

大致发生：

```text
sys.modules 中已经有 "pricing"
-> 直接复用已有模块对象
-> 当前命名空间绑定 pricing
-> 不重新执行 pricing.py
```

可以用 `is` 观察这个关系：

```python
import sys
import pricing

print(sys.modules["pricing"] is pricing)
```

通常会输出：

```text
True
```

缓存语义下需要区分两种修改。

修改内存里的模块对象：

```python
import pricing

pricing.TAX_RATE = 0.1
```

这会改变当前进程中 `pricing` 模块对象的命名空间。其他地方如果拿到的是同一个模块对象，也会看到这个变化。

修改磁盘上的源码文件则不同。假设交互环境已经导入过 `pricing`，然后编辑器里把 `pricing.py` 的 `TAX_RATE` 改成 `0.2`。这个动作只改变了磁盘文本，不会自动改写当前 Python 进程中已经存在的模块对象。再次执行：

```python
import pricing
```

仍然会优先复用 `sys.modules["pricing"]` 中的旧模块对象。要让新源码重新执行，通常需要重启解释器，或者显式：

```python
import importlib
import pricing

importlib.reload(pricing)
```

所以，源码文件是导入的来源；模块对象是导入执行后的运行时结果；`sys.modules` 是当前进程里的模块对象缓存。三者不能混成一件事。

## 入口运行和导入复用

同一个 `.py` 文件经常有两种用途：

```text
直接运行
  python pricing.py

被导入复用
  import pricing
```

两种情况都会执行模块代码，但身份不同。`__name__` 就是模块命名空间中用来表示身份的特殊名字。它不是函数参数。被普通导入时，`__name__` 通常绑定到模块名字符串：

```text
pricing 模块命名空间
  __name__ -> "pricing"
```

作为入口运行时，当前入口模块的命名空间中：

```text
__name__ -> "__main__"
```

因此可以写：

```python
def main():
    products = [
        {"sku": "tea", "cents": 1299},
        {"sku": "cup", "cents": 899},
    ]
    print(format_price(total_cents(products)))

if __name__ == "__main__":
    main()
```

这段代码的结构是：

```text
main
  普通函数对象，用来包装一次入口流程。

__name__
  当前模块命名空间中的特殊名字，表示模块身份。

if __name__ == "__main__"
  只在当前文件作为入口运行时调用 main。
```

直接运行 `pricing.py` 时，`__name__` 是 `"__main__"`，于是调用 `main()`。导入 `pricing` 时，`__name__` 是 `"pricing"`，条件不成立，入口流程不会自动启动。

这并不是把 `main()` 变成特殊函数。`main` 仍然只是模块命名空间里绑定到函数对象的普通名字。真正特殊的是入口模块身份 `"__main__"`。这样的结构让模块同时适合两件事：直接运行时能组织一次任务，被导入时能提供函数、常量或数据给其他模块复用。

## 按边界拆包，而不是按文件夹审美拆包

包不是为了让目录看起来漂亮。它的价值在于让多个模块形成清楚的归属边界、依赖方向和可复用接口。

一个小型商品目录可以拆成以下结构：

```text
catalog/
  __init__.py
  data.py
  pricing.py
  formatting.py
  cli.py
```

每个模块承担一种清楚的角色：

```text
data.py
  保存示例商品数据，或提供创建样例数据的函数。

pricing.py
  保存价格计算规则。

formatting.py
  保存展示格式化规则。

cli.py
  保存命令行入口流程。
```

依赖方向可以是：

```text
cli.py
  -> import data
  -> import pricing
  -> import formatting
```

入口模块负责组装一次运行流程，因此它依赖底层模块是自然的。反过来，让 `pricing.py` 导入 `cli.py` 通常不自然，因为价格计算不应该依赖命令行入口。如果两个模块互相导入，就容易出现循环导入：

```text
cli.py 导入 pricing.py
pricing.py 又导入 cli.py
```

循环导入不是必然死循环，也不是必然报错。原因接在前面的 `sys.modules` 规则上：Python 开始导入一个模块时，会先创建模块对象，并在执行模块代码之前把它登记到 `sys.modules`。如果导入过程中另一个模块又导入它，导入系统会从 `sys.modules` 取回这个正在初始化中的模块对象，而不是从头再次执行同一个模块。

这解释了为什么循环导入不会简单卡住：

```text
开始 import a
-> 创建 a 模块对象
-> sys.modules["a"] = a
-> 执行 a.py
-> a.py 遇到 import b

开始 import b
-> 创建 b 模块对象
-> sys.modules["b"] = b
-> 执行 b.py
-> b.py 遇到 import a
-> sys.modules 中已有 a，返回正在初始化的 a 模块对象
```

真正的风险在于：这个被返回的模块对象可能还没执行完，模块命名空间里有些名字还没有绑定。例如：

```python
# a.py
import b

VALUE_A = "a"
```

```python
# b.py
import a

print(a.VALUE_A)
```

执行 `import a` 时，`a.py` 先遇到 `import b`，于是 `VALUE_A = "a"` 还没有执行。`b.py` 又导入 `a` 时拿到的是正在初始化的 `a` 模块对象；此时 `a.VALUE_A` 尚未绑定，所以读取会失败。

换一个顺序，循环导入可能不失败：

```python
# a.py
VALUE_A = "a"

import b
```

```python
# b.py
import a

print(a.VALUE_A)
```

这次 `b.py` 读取 `a.VALUE_A` 时，`a.py` 已经先绑定过 `VALUE_A`，所以这次读取可能成功。另一个常见情况是两个模块只在函数体里使用对方，而不是在导入期间立刻读取对方的名字；由于函数体要等函数对象被调用时才执行，等调用发生时，两个模块可能都已经完成初始化。

因此，循环导入的判断不是“只要互相导入就必然错误”，而是“是否在某个模块尚未初始化完成时，读取了它尚未绑定的名字”。不过，循环导入仍然经常说明职责和依赖方向没有划清。`cli.py` 依赖 `pricing.py` 很自然；`pricing.py` 又反向依赖 `cli.py`，通常意味着入口流程和业务规则纠缠在一起。稳定的处理方式不是记住某个补丁技巧，而是重新划边界：把共同需要的常量、数据结构或函数放到更底层的模块，让导入方向保持清楚。

稳定的组织方式是：

```text
相关模块放进同一包。
可复用函数留在底层模块。
入口模块只组装流程。
导入方向从入口流向业务模块，而不是业务模块反向依赖入口。
模块对外暴露少量清楚名字，临时计算留在函数内部。
```

“对外暴露”指别人导入这个模块时真正应该使用哪些名字。例如 `pricing.py` 对外主要提供 `total_cents()` 和 `apply_discount()`；它不应该把命令行解析、打印流程和一堆临时调试名字混在同一个公共表面上。

第 02 章的数据结构也会在模块边界上出现。模块可以把容器对象作为顶层名字暴露出去：

```python
PRODUCTS = [
    {"sku": "tea", "cents": 1299, "tags": {"drink", "warm"}},
    {"sku": "cup", "cents": 899, "tags": {"tool", "kitchen"}},
]

SETTINGS = {"currency": "USD", "tax_rate": 0.08}
```

这些容器可能是配置、样例数据、注册表，或测试时使用的固定样例数据。它们可以被多个模块导入，但仍然应该有清楚归属。价格规则如果需要商品数据，可以由入口模块把数据作为参数传给函数，而不是让每个底层模块都偷偷导入并修改同一份全局容器。

## 回看 Java 和 C++

Python、Java 和 C++ 都要处理同一个问题：代码变多以后，如何组织名字、文件、复用边界和依赖方向。差异不在于谁需要模块化，而在于每种语言把这个问题放在哪一层处理。

Python 的普通路线是运行时导入模块。`.py` 文件可以作为模块被搜索、执行、缓存，并形成模块对象；包把多个模块组织到点分命名空间之下。这条路线服务的是低启动成本、交互实验、小脚本到多文件程序的连续成长。代价是许多边界问题发生在运行时：导入顺序、顶层副作用、循环导入、搜索路径和缓存都会影响行为。

Java 的组织中心更靠近包、类、接口、编译器和 JVM 平台。类和接口通常先被写进静态结构，包名组织类型命名空间，编译器和运行时共同检查类型与类路径。它不是没有运行时加载，而是把更多约束提前交给类型系统、编译流程和平台规则。

C++ 的组织中心更靠近头文件、源文件、命名空间、链接、编译单元和构建系统。它需要处理声明与定义、链接可见性、对象文件、模板实例化、二进制边界和零开销抽象。它也能组织大型程序，但不是通过 Python 式“导入模块对象并把名字绑定进当前命名空间”作为普通入口。

这样比较的目的不是给语言排名，而是把共同问题看清楚：多文件程序都需要边界。Python 把边界做成模块对象、模块命名空间、导入绑定、包和入口身份；Java 和 C++ 把更多边界放进静态类型、编译、链接、类或构建系统。

## 最小代码练习

先创建一个单文件版本 `catalog_functions.py`：

```python
PRODUCTS = [
    {"sku": "tea", "cents": 1299, "tags": {"drink", "warm"}},
    {"sku": "cup", "cents": 899, "tags": {"tool", "kitchen"}},
]

def total_cents(products):
    total = 0
    for product in products:
        total = total + product["cents"]
    return total

def format_price(cents):
    return f"${cents / 100:.2f}"

def main():
    amount = total_cents(PRODUCTS)
    print(format_price(amount))

if __name__ == "__main__":
    main()
```

这个版本能运行，但数据、计算、格式化和入口流程都在一个模块命名空间里。

再把它拆成包：

```text
catalog/
  __init__.py
  data.py
  pricing.py
  formatting.py
  cli.py
check_catalog.py
```

`catalog/data.py`：

```python
PRODUCTS = [
    {"sku": "tea", "cents": 1299, "tags": {"drink", "warm"}},
    {"sku": "cup", "cents": 899, "tags": {"tool", "kitchen"}},
]
```

`catalog/pricing.py`：

```python
def total_cents(products):
    total = 0
    for product in products:
        total = total + product["cents"]
    return total
```

`catalog/formatting.py`：

```python
def format_price(cents):
    return f"${cents / 100:.2f}"
```

`catalog/cli.py`：

```python
from catalog.data import PRODUCTS
from catalog.formatting import format_price
from catalog.pricing import total_cents

def main():
    amount = total_cents(PRODUCTS)
    print(format_price(amount))

if __name__ == "__main__":
    main()
```

`check_catalog.py`：

```python
import catalog.pricing
import catalog.pricing as pricing
from catalog.formatting import format_price

products = [
    {"sku": "tea", "cents": 1299},
]

print(catalog.pricing.total_cents(products))
print(pricing.total_cents(products))
print(format_price(1299))
```

运行：

```shell
python -m catalog.cli
python check_catalog.py
```

观察这几件事：

```text
catalog/data.py 中的 PRODUCTS 属于哪个模块命名空间？
catalog/pricing.py 中的 total_cents 是什么时候创建的？
导入 catalog.pricing 后，当前命名空间新增了哪个名字？
导入 catalog.pricing as pricing 后，当前命名空间新增了哪个名字？
from catalog.formatting import format_price 是否绑定了 formatting 这个模块名？
python -m catalog.cli 时，哪个模块的 __name__ 是 "__main__"？
```

再做一个小实验。给 `catalog/pricing.py` 顶层加一行：

```python
print("loading catalog.pricing")
```

在同一个脚本里连续写：

```python
import catalog.pricing
import catalog.pricing
```

通常只会看到一次输出。原因不是第二次导入没有发生，而是第二次导入复用了 `sys.modules` 中已经存在的模块对象。

## 反馈问题

1. 为什么程序变长后，继续把所有名字放在一个文件顶层会削弱复用边界？
2. `pricing.py` 被导入后，`pricing`、`TAX_RATE`、`total_cents` 分别处在哪个命名空间？
3. 顶层 `def` 在模块导入时会执行什么？为什么函数体不会同时执行？
4. `import catalog.pricing` 和 `import catalog.pricing as pricing` 加载的模块对象可以相同，当前命名空间的绑定有什么不同？
5. `from pricing import *` 为什么容易遮住当前文件已有名字？
6. 包为什么也是模块？它比普通模块多出的运行时特征是什么？
7. `__init__.py` 和 `__path__` 分别处在哪一层：文件系统写法，还是运行时包对象属性？
8. 改磁盘上的源码文件为什么不会自动改写当前进程中 `sys.modules` 里的旧模块对象？
9. `__name__` 为什么不是参数，而是模块命名空间里的特殊名字？
10. 拆包时为什么入口模块应该依赖业务模块，而不是业务模块反向依赖入口模块？

## 本章小结

第 04 章把前三章的机制推进到多文件尺度：

```text
对象是运行时实体
-> 容器组织多个对象引用
-> 函数对象包装可复用行为
-> 模块给一组顶层名字提供文件级命名空间
-> import 搜索、加载、缓存模块对象，并在当前命名空间写入名字绑定
-> 包把相关模块放进点分命名空间
-> __name__ 区分入口运行和导入复用
```

模块不是文件名旁边贴的标签。`.py` 文件被导入系统找到并执行后，会形成模块对象；模块对象承载自己的模块命名空间。包也不是普通文件夹审美，而是一种能包含子模块的模块，用点分模块名表达归属边界。导入规则的关键不是背语法清单，而是看清每次导入最终把哪个对象绑定到当前命名空间的哪个名字。

程序继续增长时，模块和包的价值在于让边界可见：数据有归属，函数有来源，入口流程不污染导入复用，测试能直接导入稳定对象。边界不清时，星号导入、顶层副作用、循环导入、缓存误解和按目录审美拆包都会让程序表面能跑、内部难改。Python 的模块系统选择了一条适合渐进成长的路线：先让小文件容易运行，再让这些文件自然变成可导入、可测试、可维护的多文件程序。

## Sources

- [Python Tutorial: Modules][python-modules]
- [Python Import System][python-import-system]
- [Python Execution Model][python-execution-model]
- [Python Execution Model: Naming and binding][python-naming]
- [Python `__main__`][python-main]
- [PEP 20: The Zen of Python][pep20]

[python-modules]: https://docs.python.org/3/tutorial/modules.html
[python-import-system]: https://docs.python.org/3/reference/import.html
[python-execution-model]: https://docs.python.org/3/reference/executionmodel.html
[python-naming]: https://docs.python.org/3/reference/executionmodel.html#naming-and-binding
[python-main]: https://docs.python.org/3/library/__main__.html
[pep20]: https://peps.python.org/pep-0020/
