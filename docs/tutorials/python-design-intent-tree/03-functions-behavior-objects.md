# 03. Python 为什么把行为包装成函数对象？

## 本章推理总览

第 01 章已经建立了 Python 的运行链：源码被执行后产生对象，名字把对象接入命名空间，模块把文件级命名空间变成可导入复用的单元；第 02 章进一步说明，多个对象可以通过容器形成顺序、固定组合、键值映射和唯一成员。程序已经有了“对象”和“对象之间的关系”，但真实程序还需要反复对这些关系施加行为：计算、筛选、校验、格式化、转换和组织入口流程。若这些行为只停留在模块顶层从上到下的一次性执行顺序里，它们就难以被命名、传递、测试、组合和导入。第 03 章因此推进到下一环：Python 为什么需要把行为也包装成对象，并用参数、返回值和局部命名空间组织可复用行为。

处理重复行为至少有几条路线。第一条是复制粘贴顶层代码；它启动成本最低，但一旦规则改变，多个副本会分叉，测试也只能围绕整段流程做间接验证。第二条是把行为留在模块顶层，靠全局变量和执行顺序组织；它适合极小脚本，但导入模块时会触发副作用，复用者很难只拿走其中一段行为。第三条是把行为压进类或框架生命周期；这能形成结构边界，却会让简单行为过早承担对象建模或框架约定。第四条是把一段行为包装成普通运行时对象：它有名字，可以被调用，可以接收对象引用作为输入，可以把对象作为结果返回，可以放进容器、传给别的函数、暴露在模块命名空间中，也可以被测试代码直接引用。Python 选择把 `def` 放在这条路线的中心。

这个选择延续了 Python 的对象模型，而不是绕开它。官方教程说明，执行函数定义会把函数名同函数对象关联到当前符号表中，其他名字也可以指向同一个函数对象；语言参考也把用户定义函数描述为对象，并列出函数对象携带的代码、全局命名空间、默认参数、文档字符串、注解等属性。[Python Tutorial: Defining Functions][python-functions][Python Data Model: User-defined functions][python-user-functions] 因此，`def format_price(cents): ...` 不只是“声明一段语法”，而是在当前命名空间中新增一条绑定：`format_price -> 函数对象`。第 01 章的名字和命名空间规则仍然有效；第 02 章的容器规则也继续有效，因为函数对象同样可以被列表、字典或模块保存为引用。

函数对象解决“行为如何存在”，参数绑定解决“同一段行为如何作用于不同对象”。函数对象本身保存代码、默认参数，以及“函数体里的全局名字应该去哪个模块命名空间查找”这类相对稳定的信息；每次调用函数时，解释器才为这次调用创建一个临时调用现场，并在其中维护本次调用的局部符号表。命名空间本质上是保存 `name -> object` 绑定的映射结构；它可以出现在模块、类、实例和函数调用现场等位置，但不是所有对象都天然拥有自己的命名空间。调用发生时，实参对象引用会被绑定到局部符号表中的形参名字上。官方教程把这点表述为参数按对象引用传入，并且每次调用都会创建新的局部符号表。[Python Tutorial: Defining Functions][python-functions] 这让函数不必依赖顶层固定名字，例如 `price_cents` 或 `products`，而是通过形参名字接收调用方交来的对象。参数的本质不是把外部变量名搬进函数，也不是复制一份完整对象，而是在本次调用的局部命名空间里建立新的名字绑定。由此，同一个函数对象可以被不同调用方反复调用，每次调用都有自己的局部名字集合。

返回值解决“行为完成后如何把结果交给后续代码继续使用”。没有返回值，函数只能打印、修改外部状态或依赖共享可变对象；这会让测试和复用被副作用绑住。`return` 把函数内部计算得到的对象引用交还给调用表达式，调用方再决定把这个结果绑定到名字、放进容器、传给另一个函数，还是作为模块 API 的一部分继续暴露。即使没有显式 `return`，Python 函数也会返回 `None`，这说明函数调用在语言模型里总是一个会产生结果对象的表达式，只是有些结果对象表达“没有有意义的业务结果”。[Python Tutorial: Defining Functions][python-functions]

局部命名空间解决“行为复用时如何隔离临时名字”。函数体执行时会引入新的局部符号表；赋值默认写入这个局部符号表，名字引用先查找局部，再查找外层、全局和内置命名空间。[Python Tutorial: Defining Functions][python-functions][Python Execution Model: Naming and binding][python-naming] 这让函数内部的 `total`、`result`、`product` 可以作为临时工作名字，而不会污染模块顶层，也不会与调用方同名变量自动混在一起。函数因此同时拥有两个方向：向外，它是模块命名空间里的一个对象，可以被导入、传递和测试；向内，它在每次调用时打开一个局部命名空间，让参数、临时变量和返回路径组成一次相对独立的执行。

这条路线的代价也必须保留。参数绑定的是对象引用，所以把可变容器传进函数后，函数内部如果原地修改它，调用方会看到同一个对象被改变；如果函数内部只是把形参名字重新绑定到新对象，调用方的名字绑定不会跟着改变。这不是“函数语法错误”，而是第 02 章共享可变对象问题进入行为边界后的表现。局部命名空间隔离的是名字绑定，不是自动隔离所有对象状态；返回值能让结果显式流动，但如果函数主要靠打印、修改全局变量或悄悄改变传入容器，后续代码仍然难以稳定复用这段行为。默认参数、闭包、装饰器、生成器和函数注解都能接回函数对象这条主线；它们分别属于“函数对象携带状态”“函数对象被包装”“函数执行可暂停”“函数边界可被工具读取”等后续问题。

回看前两章，函数把 Python 的运行时世界补上了“行为单位”。第 01 章中的 `__main__` 入口需要把一次运行流程收进 `main()`，避免导入时自动执行任务；第 02 章中的容器需要函数接收、遍历、转换和返回新的结构，避免顶层代码把数据处理写成一次性流程。函数对象把行为接入对象模型，参数绑定把外部对象引入本次调用，返回值把结果对象交给后续代码继续传递和组织，局部命名空间把临时名字限制在调用内部。本章的最小练习应围绕一个商品目录展开：把顶层价格格式化和筛选逻辑抽成函数，观察哪些名字属于模块命名空间，哪些名字属于函数调用的局部命名空间，哪些对象引用从参数进入，哪些对象从返回值出来，以及可变容器在函数边界上最容易制造什么隐藏副作用。

## 本章证据底座

本章关于函数定义、参数、返回值和局部符号表的用户层机制，来自 Python 官方教程的控制流工具章节。官方教程说明，`def` 会把函数名同函数对象关联到当前符号表；调用函数时会创建新的局部符号表，实参以对象引用形式传入；没有显式 `return` 的函数也会返回 `None`。[Python Tutorial: Defining Functions][python-functions]

本章关于函数对象的语言层边界，来自 Python Data Model。语言参考把用户定义函数列为对象，并说明函数对象携带代码对象、全局命名空间、默认参数、文档字符串、注解、闭包等属性。[Python Data Model: User-defined functions][python-user-functions]

本章关于名字绑定、作用域和命名空间的解释，延续 Python Execution Model。执行模型说明，名字由绑定操作引入，作用域决定一个名字在代码块中能否被直接访问；函数定义和函数调用都必须放回这套名字与命名空间规则中理解。[Python Execution Model][python-execution-model][Python Execution Model: Naming and binding][python-naming]

“函数把行为接入对象、名字、容器和模块这条运行路径”是本教程综合归纳，不是 Python 官方给出的固定术语。

## 从对象关系到可复用行为

第 01 章的核心链路是：

```text
代码执行
-> 产生或取得对象
-> 名字绑定到对象
-> 命名空间保存绑定
-> 模块承载文件级命名空间
```

第 02 章在这条链路上加入容器：

```text
对象是运行时实体
-> 容器也是对象
-> 容器保存其他对象引用
-> 不同容器表达不同对象关系
```

有了对象和对象关系，程序很快会遇到下一类压力：同一批对象需要被反复处理。

商品目录可以用列表保存多个商品，用字典保存每个商品的字段，用集合保存标签：

```python
products = [
    {"sku": "tea", "cents": 1299, "tags": {"drink", "warm"}},
    {"sku": "cup", "cents": 899, "tags": {"tool", "kitchen"}},
]
```

这段数据不是静止的。程序通常还要计算总价、格式化价格、筛选某类商品、校验字段是否存在、把结果显示给用户，或者把一次命令行运行组织成明确入口。如果这些行为都写在模块最外层，代码仍然能运行：

```python
products = [
    {"sku": "tea", "cents": 1299, "tags": {"drink", "warm"}},
    {"sku": "cup", "cents": 899, "tags": {"tool", "kitchen"}},
]

total = 0
for product in products:
    total = total + product["cents"]

print(f"${total / 100:.2f}")
```

模块顶层代码会在文件被直接运行时执行，也会在模块被导入时执行。它是一段从上到下的执行顺序，不是一个可以被单独命名和调用的行为对象。另一个模块如果只想复用“计算总价”这段行为，就很难只拿走这几行；测试代码如果只想检查总价，也必须绕着整个文件的执行和打印行为转。

函数在这一压力下出现。它不是为了多一种语法形式，而是让行为离开一次性顶层流程，变成能被名字引用、被调用、被传递、被测试、被导入的运行时对象。

## 几条可选路线

处理重复行为，至少有四条路线。

第一条路线是复制粘贴顶层代码：

```python
total = 0
for product in products:
    total = total + product["cents"]
```

它适合临时脚本。代价也很直接：规则一改，多个副本都要改；其中一个副本漏改，程序行为就会分叉。测试也只能围绕最终输出做间接检查。

第二条路线是把行为继续留在模块顶层，依赖全局名字和执行顺序：

```python
products = [...]
total = 0

for product in products:
    total = total + product["cents"]
```

这条路线启动成本低，但会把数据、计算和入口执行混在一起。被导入时，模块顶层代码也会执行。导入者原本可能只想复用商品数据或价格格式化逻辑，却被迫接受顶层打印、文件读取、网络请求或命令行解析。

第三条路线是把行为过早压进类或框架生命周期。类和框架都能组织行为，但它们回答的是更大的问题：对象如何组织状态和共享行为，应用框架如何接管入口、路由、依赖和生命周期。一个简单的价格格式化函数如果立刻变成类或框架组件，结构反而会遮住本来很小的行为。

第四条路线是把一段行为包装成普通运行时对象。它保留低启动成本，又获得复用边界：

```python
def total_cents(products):
    total = 0
    for product in products:
        total = total + product["cents"]
    return total
```

现在 `total_cents` 是当前命名空间中的名字，它绑定到一个函数对象。后续代码可以调用它，可以测试它，可以从模块中导入它，也可以把它传给别的函数。

Python 选择这条路线作为普通行为复用的中心。

## `def` 不是静态声明，而是一次名字绑定

官方教程说明，函数定义会把函数名引入当前符号表，并关联到函数对象。[Python Tutorial: Defining Functions][python-functions]

因此：

```python
def format_price(cents):
    return f"${cents / 100:.2f}"
```

执行后，当前模块命名空间中出现一条绑定：

```text
format_price -> 函数对象
```

这和第 01 章的运行模型是一致的。`def` 不是把源码中的几行代码变成一种完全独立于对象模型之外的声明；它是在执行过程中创建函数对象，并把名字绑定到这个对象上。

函数对象和整数对象、列表对象、模块对象的类型不同，支持的操作也不同。函数对象最重要的能力是可以被调用：

```python
price_text = format_price(1299)
```

这段代码先在当前命名空间中查找 `format_price`，找到函数对象，再调用这个对象。调用得到的结果对象再绑定到 `price_text`。

同一个函数对象也可以被另一个名字引用：

```python
show_price = format_price

print(show_price(2500))
```

当前命名空间中有两条名字绑定：

```text
format_price -> 函数对象
show_price   -> 同一个函数对象
```

这个赋值没有复制一份函数代码。`show_price = format_price` 先通过名字 `format_price` 找到函数对象，再把名字 `show_price` 绑定到同一个对象。这和第 02 章中多个名字指向同一个列表对象是同一类绑定关系，只是对象类型换成了函数。

函数对象也可以放进容器：

```python
formatters = {
    "price": format_price,
}

print(formatters["price"](1299))
```

这个字典保存的是函数对象引用。后续代码通过键 `"price"` 找到函数对象，再调用它。函数因此自然接回第 02 章的容器模型：容器可以保存数据对象，也可以保存行为对象。

## 参数绑定：让同一段行为作用于不同对象

函数对象让行为可以存在；参数让同一段行为可以作用于不同对象。

没有参数时，函数只能依赖固定的外部名字：

```python
products = [
    {"sku": "tea", "cents": 1299},
    {"sku": "cup", "cents": 899},
]

def total_cents():
    total = 0
    for product in products:
        total = total + product["cents"]
    return total
```

这段代码能运行，但 `total_cents` 被模块顶层的名字 `products` 绑住了。另一个商品列表要复用这段计算，只能先改全局名字，或者复制函数。

参数把这段行为改成“接收一组商品对象，再计算总价”：

```python
def total_cents(items):
    total = 0
    for product in items:
        total = total + product["cents"]
    return total
```

调用时：

```python
products = [
    {"sku": "tea", "cents": 1299},
    {"sku": "cup", "cents": 899},
]

amount = total_cents(products)
```

可以分成两层看：

```text
模块命名空间
  products    -> list 对象
  total_cents -> 函数对象

调用 total_cents(products) 时
  创建本次调用现场
  items -> 同一个 list 对象
```

参数绑定不是把外部变量名 `products` 搬进函数，也不是复制一份完整列表。调用表达式先通过外部名字 `products` 找到 list 对象，再把这个对象引用绑定到本次调用局部命名空间里的形参名字 `items`。

函数对象还会记住自己定义时所在的模块命名空间，用来查找函数体里的全局名字。这个信息服务的是同一件事：函数被传到别处调用时，行为仍然按定义处的名字边界运行。例如一个函数体使用模块顶层的 `TAX_RATE`，调用时局部命名空间里只会有形参 `cents`；`TAX_RATE` 不是局部名字，就会回到函数定义所在模块的全局命名空间中查找。这种关联意味着：函数对象连着那张模块级名字表，需要查全局名字时去这张表里找，而不是把模块里的全局对象复制一份放进函数对象。[Python Data Model: User-defined functions][python-user-functions]

所以，同一个函数对象可以作用于不同对象：

```python
morning = [{"sku": "tea", "cents": 1299}]
evening = [{"sku": "cup", "cents": 899}]

print(total_cents(morning))
print(total_cents(evening))
```

两次调用使用同一个函数对象，但各自有自己的局部名字集合：

```text
第一次调用
  items -> morning 绑定的 list 对象
  total -> int 对象
  product -> 当前商品 dict 对象

第二次调用
  items -> evening 绑定的 list 对象
  total -> int 对象
  product -> 当前商品 dict 对象
```

函数对象不是参数表本身，参数表属于一次调用。

## 返回值：让结果继续留在程序里

函数如果只打印结果，后续代码很难继续使用这个结果：

```python
def show_total(products):
    total = 0
    for product in products:
        total = total + product["cents"]
    print(f"${total / 100:.2f}")
```

这段函数适合显示结果，却不适合复用计算结果：

```python
amount = show_total(products)
```

如果没有显式 `return`，`amount` 会绑定到 `None`。价格数字已经打印到屏幕上，但没有作为对象交回给调用方。官方教程说明，函数没有 `return` 语句时也会返回一个值，只是这个值通常是 `None`。[Python Tutorial: Defining Functions][python-functions]

返回值把函数内部计算出的对象交给调用表达式：

```python
def total_cents(products):
    total = 0
    for product in products:
        total = total + product["cents"]
    return total

def format_price(cents):
    return f"${cents / 100:.2f}"

amount = total_cents(products)
text = format_price(amount)
```

每一步都把结果作为对象留在程序内部：

```text
total_cents(products)
  -> int 对象 2198

amount
  -> int 对象 2198

format_price(amount)
  -> str 对象 "$21.98"

text
  -> str 对象 "$21.98"
```

调用方可以把返回结果绑定到名字，放进容器，传给另一个函数，或者在测试中直接断言：

```python
assert total_cents([{"sku": "tea", "cents": 1299}]) == 1299
assert format_price(1299) == "$12.99"
```

返回值让函数从“做完一件事”变成“做完一件事，并把结果对象交给后续代码”。

## 局部命名空间：隔离临时名字

函数内部经常需要临时名字：

```python
def total_cents(products):
    total = 0
    for product in products:
        total = total + product["cents"]
    return total
```

`total` 和 `product` 是这次计算的工作名字。它们不应该污染模块顶层，也不应该和调用方恰好同名的变量自动混在一起。

Python 用函数调用的局部符号表隔离这些名字。官方教程说明，执行函数会引入一个新的局部符号表，函数中的变量赋值会把值保存到这个局部符号表中；引用变量时，解释器会先查找局部符号表，再查找外层函数、全局符号表和内置名字。[Python Tutorial: Defining Functions][python-functions]

示例：

```python
total = "module total"

def total_cents(products):
    total = 0
    for product in products:
        total = total + product["cents"]
    return total

amount = total_cents([{"cents": 100}])

print(total)
print(amount)
```

运行关系可以理解为：

```text
模块命名空间
  total -> str 对象 "module total"
  total_cents -> 函数对象
  amount -> int 对象 100

total_cents 本次调用的局部命名空间
  products -> list 对象
  total -> int 对象 100
  product -> dict 对象
```

函数内部的 `total` 和模块顶层的 `total` 是两个不同命名空间里的名字。局部命名空间隔离的是名字绑定，使函数内部可以使用清楚的临时名字，而不把这些名字写进模块顶层。

命名空间不是所有对象都天然拥有的东西。它是保存 `name -> object` 绑定的映射结构。模块有模块命名空间；函数调用现场有本次调用的局部命名空间；类和很多实例也会关联自己的属性命名空间。普通整数、字符串、列表本身不因为被赋值就拥有一个保存源码名字的命名空间。名字通常存在于外部命名空间中，对象被这些名字引用。

模块的全局命名空间在 Python 可观察层面通常由 `dict` 对象承载。这个 `dict` 仍然是 Python 对象模型中的对象，只是它承担的是名字查找表的角色，而不是普通业务数据的角色。`product = {"sku": "tea"}` 中的字典是用户程序的数据结构；`globals()` 返回的字典保存模块级名字绑定；函数对象的 `__globals__` 指向定义它时所在模块的全局命名空间字典。它们都可以是 `dict` 对象，区别在于这张表被程序当作商品记录使用，还是被解释器当作 `name -> object` 的查找表使用。[Python Data Model: User-defined functions][python-user-functions][Python Built-in Functions: globals][python-globals]

函数体里遇到全局名字时，会回到函数定义所在模块的名字表中查找对象。`__globals__` 让这张表可以被观察到：它显示的是函数关联的模块级命名空间，而不是一份复制出来的全局对象清单。这样，函数即使被导入到别的模块、放进容器或传给别的函数，函数体里的全局名字仍然沿着定义处的模块边界查找。

## 修改对象和重新绑定名字不是一回事

局部命名空间隔离名字绑定，但不会自动复制对象状态。

如果函数收到一个可变容器，并原地修改这个容器，外部持有同一对象引用的名字也会看到变化：

```python
def add_sale_tag(product):
    product["tags"].add("sale")

item = {"sku": "tea", "tags": {"drink"}}

add_sale_tag(item)

print(item)
```

调用时：

```text
模块命名空间
  item -> dict 对象

add_sale_tag 本次调用的局部命名空间
  product -> 同一个 dict 对象
```

函数内部的 `product["tags"].add("sale")` 修改的是共享的 `set` 对象。函数调用结束后，模块命名空间里的 `item` 仍然指向同一个 dict 对象，所以外部能看到标签变化。

重新绑定形参名字则不同：

```python
def replace_product(product):
    product = {"sku": "cup", "tags": set()}

item = {"sku": "tea", "tags": {"drink"}}

replace_product(item)

print(item)
```

`product = ...` 只改变本次调用局部命名空间里的绑定：

```text
调用开始
  product -> item 指向的 dict 对象

执行 product = ...
  product -> 新 dict 对象
```

模块命名空间里的 `item` 没有重新绑定，所以外部看到的仍然是原来的商品对象。

这正是第 02 章共享可变对象问题进入函数边界后的形态：

```text
修改共享可变对象
  外部能看到。

重新绑定局部名字
  外部名字不变。
```

因此，函数边界并不自动意味着“没有副作用”。参数让对象引用进入函数，局部命名空间隔离名字，返回值让结果显式流出；是否修改传入对象，则是函数行为本身的设计选择。

## 入口流程为什么常放进 `main()`

第 01 章已经说明，同一个模块既可能被直接运行，也可能被导入复用。第 03 章可以把这个结论推进一步：入口运行本身也应该被包装成函数。

不包装时：

```python
products = [
    {"sku": "tea", "cents": 1299},
    {"sku": "cup", "cents": 899},
]

print(format_price(total_cents(products)))
```

如果另一个文件导入这个模块，顶层打印也会发生。导入者不一定想运行整个程序，它可能只想复用 `total_cents` 或 `format_price`。

更清楚的结构是：

```python
def total_cents(products):
    total = 0
    for product in products:
        total = total + product["cents"]
    return total

def format_price(cents):
    return f"${cents / 100:.2f}"

def main():
    products = [
        {"sku": "tea", "cents": 1299},
        {"sku": "cup", "cents": 899},
    ]
    print(format_price(total_cents(products)))

if __name__ == "__main__":
    main()
```

这段结构分成三层：

```text
total_cents
  可导入、可测试、可复用的计算行为。

format_price
  可导入、可测试、可复用的格式化行为。

main
  组织一次入口运行的流程。
```

`main()` 不是 Python 强制要求的特殊函数名。它只是普通函数对象，被模块顶层的入口判断调用。它的价值在于把“一次运行要做什么”也从顶层流程里收束出来，使导入复用和入口执行分开。

## 后续机制的位置

函数对象这条主线以后会长出更多机制。

默认参数可以接回“函数对象携带相对稳定的信息”。闭包可以接回“函数对象如何记住外层名字”。装饰器可以接回“函数对象如何被另一个函数包装或替换”。生成器可以接回“函数执行如何暂停并逐步产生结果”。函数注解可以接回“函数边界如何被工具、类型检查器或框架读取”。

这些机制都重要，但它们不属于本章的中心。本章建立的基础运行路径是：

```text
def 执行后创建函数对象
-> 名字绑定到函数对象
-> 调用函数时创建本次调用现场
-> 参数名绑定到实参对象引用
-> 局部名字留在本次调用内部
-> return 把结果对象交给调用方
```

## 回看 Java 和 C++

Python、Java 和 C++ 都要处理同一个问题：行为如何被命名、调用、复用和组织。差异不在于谁能复用行为，而在于每种语言把这个问题放在什么中心。

Python 把普通函数放进运行时对象模型。`def` 执行后产生函数对象，名字绑定到函数对象，函数对象可以放进容器、作为参数传递、作为返回值返回，也可以作为模块 API 暴露。这条路线服务的是低启动成本、交互实验、脚本到模块的连续成长，以及运行时组合能力。

Java 的普通行为通常以方法形式依附在类或接口上。Java 也有 lambda、method reference 和函数式接口，但它们仍然服务静态类型、类、接口和编译期检查这套中心。调用方依赖的是类型声明、方法签名和接口契约，而不是先把所有行为都理解成 Python 式普通运行时函数对象。[Java Language Specification: Classes][java-jls-classes][Java Language Specification: Functional Interfaces][java-jls-functional]

C++ 也能表达函数、函数指针、函数对象、lambda 和模板化可调用对象，但它的中心更靠近类型、存储、生命周期、调用开销和编译期实例化。C++ 标准把函数和对象区分开来；函数不是对象。这不是缺陷，而是服务系统编程、布局控制和零开销抽象的设计取向。[C++ Object Model][cpp-object-model][C++ Functions][cpp-functions]

因此，Python 函数不是“比方法更简单”的孤立语法，而是它的运行时对象模型继续向行为扩展的结果。

## 最小代码练习

创建 `catalog_functions.py`：

```python
def total_cents(products):
    total = 0
    for product in products:
        total = total + product["cents"]
    return total

def format_price(cents):
    return f"${cents / 100:.2f}"

def add_sale_tag(product):
    product["tags"].add("sale")

def replace_product(product):
    product = {"sku": "cup", "cents": 899, "tags": set()}
    return product

def main():
    products = [
        {"sku": "tea", "cents": 1299, "tags": {"drink", "warm"}},
        {"sku": "cup", "cents": 899, "tags": {"tool", "kitchen"}},
    ]

    amount = total_cents(products)
    print(format_price(amount))

    item = products[0]
    add_sale_tag(item)
    print(item)

    new_item = replace_product(item)
    print(item)
    print(new_item)

if __name__ == "__main__":
    main()
```

运行：

```shell
python catalog_functions.py
```

再创建 `check_catalog_functions.py`：

```python
from catalog_functions import format_price, total_cents

products = [
    {"sku": "tea", "cents": 1299, "tags": {"drink"}},
]

assert total_cents(products) == 1299
assert format_price(1299) == "$12.99"
```

运行：

```shell
python check_catalog_functions.py
```

观察四件事：

```text
total_cents 和 format_price 为什么可以被导入而不自动运行 main？
total_cents(products) 调用时，products 和 items 分别在哪个命名空间中？
add_sale_tag 没有 return，为什么外部 item 仍然变化？
replace_product 重新绑定 product，为什么外部 item 没有变成新商品？
```

## 反馈问题

1. 为什么第 03 章不是从函数语法清单开始，而是从对象和容器之后的重复行为开始？
2. `def format_price(cents): ...` 执行后，当前命名空间新增了什么绑定？
3. 函数对象本身保存什么，本次函数调用的局部命名空间保存什么？
4. 函数被导入到别的模块后，函数体里的全局名字为什么仍按定义它的模块查找？
5. 参数绑定为什么不是把外部变量名搬进函数？
6. 函数内部修改传入的可变容器，为什么外部能看到？
7. 函数内部重新绑定形参名字，为什么外部名字不跟着改变？
8. `return` 相比 `print`，为什么更有利于测试和复用？
9. `main()` 为什么只是普通函数，却能帮助区分入口运行和导入复用？

## 本章小结

第 01 章说明 Python 运行时世界由对象、名字、命名空间和模块组织起来。第 02 章说明容器把多个对象引用组织成不同关系。第 03 章在这个基础上加入函数：

```text
对象是运行时实体
-> 容器组织多个对象引用
-> 程序需要反复处理对象和容器
-> def 创建函数对象并绑定名字
-> 调用函数时创建本次调用现场
-> 参数名绑定到实参对象引用
-> 局部命名空间隔离临时名字
-> return 把结果对象交给调用方
```

函数不是孤立语法点。它是 Python 把行为接入对象模型、命名空间、容器、模块和测试的一种基础机制。理解函数时，最重要的不是先背参数种类，而是分清三件事：函数对象如何被创建和绑定，函数调用如何创建局部命名空间，函数内部到底是在修改共享对象，还是只是在重新绑定局部名字。

## Sources

- [Python Tutorial: Defining Functions][python-functions]
- [Python Data Model: User-defined functions][python-user-functions]
- [Python Execution Model][python-execution-model]
- [Python Execution Model: Naming and binding][python-naming]
- [Python Reference: Function definitions][python-function-definitions]
- [Python Built-in Functions: globals][python-globals]
- [Java Language Specification: Classes][java-jls-classes]
- [Java Language Specification: Functional Interfaces][java-jls-functional]
- [C++ Object Model][cpp-object-model]
- [C++ Functions][cpp-functions]

[python-functions]: https://docs.python.org/3/tutorial/controlflow.html#defining-functions
[python-user-functions]: https://docs.python.org/3/reference/datamodel.html#user-defined-functions
[python-execution-model]: https://docs.python.org/3/reference/executionmodel.html
[python-naming]: https://docs.python.org/3/reference/executionmodel.html#naming-and-binding
[python-function-definitions]: https://docs.python.org/3/reference/compound_stmts.html#function-definitions
[python-globals]: https://docs.python.org/3/library/functions.html#globals
[java-jls-classes]: https://docs.oracle.com/en/java/javase/26/docs/specs/jls/jls-8.html
[java-jls-functional]: https://docs.oracle.com/en/java/javase/26/docs/specs/jls/jls-9.html#jls-9.8
[cpp-object-model]: https://eel.is/c++draft/intro.object
[cpp-functions]: https://eel.is/c++draft/dcl.fct
