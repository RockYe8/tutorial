# 02. Python 为什么用 `list`、`tuple`、`dict`、`set` 组织对象？

## 本章推理总览

第 01 章已经把 Python 的运行时世界立在对象、名字、命名空间和模块上：代码执行后产生对象，名字让代码找到对象，命名空间隔离名字，模块把文件级命名空间变成可复用单元。第 02 章接住“对象”这一环继续向前。真实程序很少只处理一个对象；价格表、订单、用户、配置、日志、模型消息、工具参数都会把多个对象放在一起，并要求后续代码能稳定地查找、遍历、更新、去重、传递和测试。问题因此从“对象如何存在”推进到“多个对象如何组成仍然可组合的数据结构”。

有几条路线可以处理多个对象。第一条是继续使用一堆分散名字，例如 `price1`、`price2`、`price3`；它适合极小脚本，但数量一变就难以遍历、传参和测试。第二条是把数据压成文本记录；它容易打印、保存和跨进程传递，但结构会丢失，后续代码要重新解析字符串。第三条是只提供一种通用容器；表面更简单，但顺序、键值查找、唯一性、可变性和记录含义会挤在同一种结构里，代码很快需要靠约定补充语义。第四条是提供几种小而常用的内置容器，让不同结构压力落到不同类型上。

Python 选择第四条路线。这个选择延续第 01 章的对象模型。容器也是对象，但它的主要作用不是表示一个单独值，而是保存其他对象的引用，并用某种结构规定这些对象之间的关系。这里要区分名字和对象引用：名字绑定存在于命名空间里，例如 `products -> list 对象`；对象引用存在于运行时结构里，例如这个 `list` 对象内部的第 0 个元素位置引用 `"tea"`，第 1 个元素位置引用 `"cup"`。二者都让某个地方能找到对象，但查找规则不同：名字通过命名空间查找，容器内部引用通过索引、键或成员关系查找。

因此，容器不是脱离对象模型的新概念，而是对象模型继续长出的组织机制。`list` 表达可变顺序，适合一组同类项目按位置或顺序处理；`tuple` 表达固定组合，适合把几个位置含义稳定的对象作为一个整体传递；`dict` 表达键到值的映射，适合通过稳定键查找对象；`set` 表达唯一性边界，适合判断成员是否已经出现。它们不是四个孤立语法点，而是 Python 对“多个对象之间是什么关系”的四种基础回答。

这种设计的好处是组合能力强。表达式可以生成对象，容器可以保存这些对象引用，函数可以接收容器，模块可以暴露容器，测试可以直接断言容器内容。数据结构因此连接第 01 章的运行时模型和后续函数、模块、异常、类、类型提示：函数需要明确接收什么结构，模块会暴露结构化配置，异常经常携带结构化上下文，类会把对象关系封装成行为，类型提示会把容器边界写成工程契约。容器选择不是“哪个 API 会用”，而是“这组对象之间的关系是什么”。

这条路线也有代价。容器保存对象引用，不保存名字；可变容器被多个名字共享时，修改会从所有引用路径可见；`list`、`tuple`、`dict`、`set` 的表面语法简单，但选错结构会让代码含义变模糊：用 `list` 表示唯一集合会产生重复处理，用 `dict` 表示顺序流程会让键承担过多语义，用可变对象跨函数传递会带来隐藏副作用。CPython 实现层可以解释部分现象，例如容器持有对象引用、`dict` 支撑高效键查找、`set` 基于唯一性判断；但本章的重点仍是 Python 语言模型层：容器是组织对象关系的运行时对象，结构选择决定后续代码如何读取和组合这些对象。

本章练习使用一个极小的商品目录，让同一组数据同时出现 `list`、`dict`、`set` 和可选的 `tuple`。练习不以方法清单为目标，而是要求回答：哪些对象存在，哪个名字绑定到哪个容器对象，容器内部保存了哪些对象引用，为什么外层是 `list`，为什么每个商品适合用 `dict`，为什么标签适合用 `set`，如果商品记录改成 `tuple` 会牺牲什么、得到什么。完成这组判断后，`list`、`dict`、`tuple`、`set` 才会从四个名词变成一张关于对象关系的选择图。

## 本章证据底座

本章关于 `list`、`tuple`、`dict`、`set` 的用户层机制，来自 Python 官方教程的数据结构章节和内置类型文档。官方教程把列表、元组、集合、字典放在早期核心章节中，并分别说明列表的可变序列行为、元组的不可变序列用途、集合的唯一性和成员测试、字典的键值映射。[Python Tutorial: Data Structures][python-data-structures][Built-in Types][python-built-in-types]

本章关于对象、名字、绑定和命名空间的解释，延续 Python Data Model 和 Execution Model。Python 数据模型说明 Python 程序中的数据由对象或对象之间的关系表示；执行模型说明名字由赋值、函数定义、类定义、导入等操作绑定到对象。[Python Data Model][python-data-model][Python Execution Model][python-execution-model]

本章关于 CPython 实现层的说明，只用于澄清“容器保存对象引用”与“名字绑定到对象”的区别。Python 是语言，规定对象、名字、序列、映射、集合这些语言层行为；CPython 是最常见的 Python 实现，用 C 写成，负责把这些语言规则做成可执行程序。CPython C API 文档把运行时对象、类型和引用计数作为扩展层事实边界；列表、元组、字典、集合各有自己的 C API，这些资料说明不同容器在实现层有不同结构，但都仍然操作 Python 对象引用。[Python/C API: Objects, Types and Reference Counts][python-c-api-intro][Python/C API: List Objects][python-c-api-list][Python/C API: Tuple Objects][python-c-api-tuple][Python/C API: Dictionary Objects][python-c-api-dict][Python/C API: Set Objects][python-c-api-set]

“容器选择是一种对象关系设计”是本教程综合归纳，不是 Python 官方给出的固定术语。

## 从一个对象到一组对象

第 01 章的基本链路是：

```text
代码执行
-> 产生或取得对象
-> 名字绑定到对象
-> 命名空间保存绑定
-> 模块承载文件级命名空间
```

这条链可以解释单个对象：

```python
price_cents = 1299
```

运行后，当前命名空间出现一条绑定：

```text
price_cents -> int 对象 1299
```

真实数据很快会超过一个对象：

```python
sku = "tea"
price_cents = 1299
currency = "USD"
tag1 = "drink"
tag2 = "warm"
```

这些名字都能绑定对象，但它们还没有形成一个清晰结构。后续代码如果要“把这件商品作为一个整体传给函数”，只能依赖一组分散名字。再增加第二件商品时，名字会继续膨胀：

```python
sku1 = "tea"
price_cents1 = 1299
sku2 = "cup"
price_cents2 = 899
```

分散名字的问题不是 Python 无法运行，而是后续组合变困难。函数参数会变长，循环无法自然表达，测试要逐个名字断言，模块暴露的状态也会缺少边界。对象已经存在，但对象之间的关系没有被程序表示出来。

数据结构就是在这里出现的。它不是“更多语法”，而是把多个对象组织成一个仍然能被名字绑定、传递、返回、导入和测试的运行时对象。

## 几条可选路线

处理多个对象，至少有四条路线。

第一条路线是继续使用分散名字。它适合临时计算：

```python
price1 = 1299
price2 = 899
total = price1 + price2
```

一旦数量来自用户输入、文件、接口或数据库，这条路线就失效。名字是源码里的标识符，程序运行时不能靠提前写好无限多个 `price1`、`price2`、`price3` 来表达未知数量的数据。

第二条路线是把多个对象压成文本：

```python
product = "tea,1299,drink|warm"
```

这条路线容易打印、复制和跨进程传递，但结构消失了。`1299` 在文本里只是字符，标签边界也要靠字符串约定恢复。后续代码每次都要重新解析，错误会变成“字符串格式不符合约定”的问题。

第三条路线是只提供一种通用容器。所有数据都放进同一种结构，表面概念更少，但不同关系会混在一起。顺序列表、键值映射、唯一集合、固定记录本来回答不同问题；强行压到一种结构里，代码会把语义转移到注释、命名和隐含约定中。

第四条路线是提供少数高频容器类型。Python 选择这条路线：`list`、`tuple`、`dict`、`set` 都是对象，也都能保存其他对象引用，但它们用不同结构表达不同关系。官方教程的数据结构章节正是沿着这些类型展开，而不是只给出一个万能容器。[Python Tutorial: Data Structures][python-data-structures]

这四种不是 Python 全部内置类型，也不是全部容器。Python 还有 `str`、`range`、`bytes`、`bytearray`、`memoryview`、`frozenset` 等内置类型；标准库 `collections` 还提供 `deque`、`Counter`、`defaultdict` 等专门容器。本章选择 `list`、`tuple`、`dict`、`set`，是因为它们最早支撑普通程序里的四种基础组织关系：顺序、固定位置、键值映射和唯一成员。其他容器以后可以接回这四种关系继续理解。[Built-in Types][python-built-in-types]

## 容器是什么

容器是一类对象，它的主要作用是保存其他对象的引用，并用某种结构规定这些对象之间的关系。

这句话分三层：

```text
容器是一类对象
  list、tuple、dict、set 本身都是运行时对象。

容器保存其他对象的引用
  容器里保存的不是源码名字，而是对对象的运行时引用。

容器规定对象之间的关系
  list 规定顺序，tuple 规定固定位置，dict 规定 key -> value，set 规定唯一性。
```

这四种关系可以用同一组商品数据看清楚。

`list` 规定顺序：

```python
products = ["tea", "cup", "spoon"]
```

这里的重点不是有三个字符串，而是这三个字符串对象被放进同一个顺序结构：

```text
products -> list 对象

list 对象内部
  0 -> "tea"
  1 -> "cup"
  2 -> "spoon"
```

读取 `products[0]` 得到 `"tea"`，读取 `products[1]` 得到 `"cup"`。位置是结构的一部分。把 `"cup"` 放在第 1 位，和把它放在第 2 位，表示的顺序关系不同。

`tuple` 规定固定位置：

```python
price = ("tea", 1299, "USD")
```

这里的重点不是“它也有第 0 位、第 1 位、第 2 位”，而是这些位置的含义稳定：

```text
price -> tuple 对象

tuple 对象内部
  0 -> sku
  1 -> cents
  2 -> currency
```

读取 `price[1]` 得到 `1299`，因为这条记录约定第 1 位就是价格分值。`tuple` 适合这种小而稳定的组合：几个对象作为一个整体传递，位置含义不打算在运行中变化。

“固定位置”包含两层意思。第一层是语义固定：程序设计者约定第 0 位是 `sku`，第 1 位是 `cents`，第 2 位是 `currency`，后续代码就按这个位置含义读取。Python 解释器只知道这是一个元组对象，以及第 0、1、2 位分别引用哪些对象；解释器本身并不知道这些位置叫 `sku`、`cents`、`currency`。这些含义来自代码中的变量名、解包方式、函数返回约定和上下文。第二层是结构固定：`tuple` 创建后，不能把第 1 位重新改成另一个对象。

```python
price = ("tea", 1299, "USD")
price[1] = 999
```

这会报错，因为元组对象不支持给单个位置重新赋值。Python 官方教程明确说明元组不可变，不能给单个元素赋值；同时也说明元组可以包含可变对象。[Python Tutorial: Data Structures][python-data-structures]

所以 `tuple` 的位置关系后续不能在这个元组对象上原地改变。需要改变价格时，通常是创建一个新的元组：

```python
price = ("tea", 1299, "USD")
price = ("tea", 999, "USD")
```

这里变化的是名字 `price` 的绑定：它从旧元组对象重新绑定到新元组对象。旧元组没有被修改。

这也是 `tuple` 和 `dict` 的一个关键差别。`tuple` 把字段含义放在位置约定里：

```python
price_tuple = ("tea", 1299, "USD")
```

第 1 位代表什么，要看使用它的上下文：

```python
sku, cents, currency = price_tuple
```

`dict` 把字段含义放在键里：

```python
price_dict = {"sku": "tea", "cents": 1299, "currency": "USD"}
```

`"cents"` 这个键直接写在数据结构里。`tuple` 更紧凑，适合小而稳定的位置组合；`dict` 更显式，适合字段含义需要直接暴露在数据结构里的记录。

`dict` 规定 `key -> value`：

```python
product = {"sku": "tea", "cents": 1299, "currency": "USD"}
```

这里不靠位置读数据，而靠键读数据：

```text
product -> dict 对象

dict 对象内部
  "sku"      -> "tea"
  "cents"    -> 1299
  "currency" -> "USD"
```

读取 `product["cents"]` 得到 `1299`。键 `"cents"` 明确表达这个值的含义，所以字段变多时，代码不必依赖“第几个位置是什么”的外部约定。

`set` 规定唯一性：

```python
tags = {"drink", "warm", "drink"}
```

这里的重点不是保存插入顺序，而是成员唯一：

```text
tags -> set 对象

set 对象内部
  成员 -> "drink"
  成员 -> "warm"
```

`"drink"` 写了两次，集合里仍然只有一个 `"drink"` 成员。读取时通常关心的是成员关系：

```python
"drink" in tags
```

这个表达式回答的是：`"drink"` 是否属于这组标签。它不回答 `"drink"` 是第几个标签，因为 `set` 的结构重点不是位置，而是唯一成员边界。

## 四种容器的核心特性

`list`、`tuple`、`dict`、`set` 的方法很多，但结构选择首先取决于更基础的特性：它们表达什么关系，是否可变，通过什么方式查找对象，适合承载哪类数据，以及会带来什么代价。

```text
list
  关系：顺序。
  可变性：可变，可以追加、删除、替换、排序。
  查找方式：按整数索引、切片、迭代。
  适合：数量会变化的一组对象，尤其是按顺序处理的同类项目。
  代价：不保证唯一性；从中间或开头频繁插入删除可能不合适；共享可变列表会产生副作用。

tuple
  关系：固定位置。
  可变性：元组自身不可变，不能替换某个位置的引用。
  查找方式：按整数索引、解包、迭代。
  适合：小而稳定的组合，位置含义明确，例如坐标、返回多个结果、简单记录。
  代价：字段含义靠位置约定；字段一多，可读性下降；若内部引用可变对象，被引用对象仍可变。

dict
  关系：key -> value 映射。
  可变性：可变，可以新增、更新、删除键值对。
  查找方式：按键查找。
  适合：通过稳定名字、编号或键查找字段和值，例如商品记录、配置、索引表。
  代价：键名承担语义；键必须满足可哈希要求；结构能表达字段名，但不能自动保证领域含义正确。

set
  关系：唯一成员。
  可变性：set 可变；frozenset 不可变。
  查找方式：成员测试、集合运算、迭代。
  适合：去重、成员测试、交集并集差集等唯一性问题。
  代价：不表达位置；不能通过索引读取第几个元素；元素必须满足可哈希要求。
```

这些特性都接回同一个判断：容器选择是在选择对象之间的关系。要表达“按顺序处理”，选 `list`；要表达“几个位置组成一个稳定整体”，选 `tuple`；要表达“通过键找值”，选 `dict`；要表达“成员唯一”，选 `set`。

例如：

```python
products = ["tea", "cup"]
```

运行后的关系是：

```text
当前命名空间
  products -> list 对象

list 对象内部
  第 0 个元素位置 -> str 对象 "tea"
  第 1 个元素位置 -> str 对象 "cup"
```

`products` 是名字。它存在于当前命名空间中，用来找到 `list` 对象。`"tea"` 和 `"cup"` 不是名字，而是字符串对象。`list` 对象内部保存的是对这两个字符串对象的引用。

再看字典：

```python
product = {"sku": "tea", "cents": 1299}
```

运行关系是：

```text
当前命名空间
  product -> dict 对象

dict 对象内部
  str 对象 "sku"   -> str 对象 "tea"
  str 对象 "cents" -> int 对象 1299
```

`product` 是名字；`dict` 内部的 `"sku"`、`"cents"` 是键对象；`"tea"`、`1299` 是值对象。字典的结构规定了“通过键找到值”的关系。

## 名字绑定和对象引用

名字绑定和对象引用都能让某个地方找到对象，但它们处在不同层次。

```text
名字绑定
  存在于命名空间中。
  左边是源码中的名字，例如 products、product、price。
  查找方式是按作用域和命名空间查找名字。

对象引用
  存在于运行时对象结构中。
  左边不是源码名字，而是元素位置、键、成员、属性、函数参数槽或返回值等结构位置。
  查找方式由对象类型决定，例如索引、键查找、成员测试或属性访问。
```

示例：

```python
x = ["tea", "cup"]
y = x
```

当前命名空间中有两条名字绑定：

```text
x -> list 对象
y -> 同一个 list 对象
```

这个 `list` 对象内部有两个元素引用：

```text
第 0 个元素位置 -> str 对象 "tea"
第 1 个元素位置 -> str 对象 "cup"
```

`x` 和 `y` 是名字。第 0 个元素位置不是名字，它不参与命名空间查找。它只是 `list` 对象内部结构中的一个位置。执行 `x[0]` 时，Python 先通过名字 `x` 找到 `list` 对象，再由 `list` 类型规定的索引规则找到第 0 个元素引用。

这也解释了为什么容器保存的是对象引用，不是变量名：

```python
tea = "tea"
products = [tea]
tea = "green tea"

print(products[0])
```

输出是：

```text
tea
```

`products = [tea]` 执行时，Python 先查找名字 `tea`，取得当时绑定的字符串对象 `"tea"`，再把这个对象引用放进列表。后面 `tea = "green tea"` 只是让名字 `tea` 重新绑定到另一个字符串对象；列表内部保存的旧对象引用没有因为名字重新绑定而改变。

## `list`：可变顺序

`list` 表达一组对象的顺序关系。官方教程把列表作为可变序列来介绍，并展示 `append`、`pop`、`sort`、切片、列表推导等操作；内置类型文档也把 `list` 放在序列类型体系中。[Python Tutorial: Data Structures][python-data-structures][Built-in Types: Sequence Types][python-sequence-types]

`list` 解决的是“数量会变化的一组对象如何保持顺序”的压力。真实程序经常不知道一开始会有多少个对象：从文件读到多行记录，从接口拿到多条消息，从用户输入得到多个商品，从模型响应中收集多个候选结果。这些对象需要按顺序追加、遍历、筛选、排序，后续函数也需要把这整组对象作为一个参数接收。

如果只用分散名字表达这类数据，数量变化会让源码膨胀。如果用 `tuple`，结构会暗示位置关系固定，不适合持续追加或删除。如果用 `set`，顺序关系丢失。如果用 `dict`，每个元素都需要人为设计一个键，而很多时候数据本身只是“按顺序出现的一组项目”。`list` 的设计把这些压力集中成一种结构：保留顺序，允许变化。

顺序关系适合表达“这些项目按某个顺序排列，可以遍历，可以追加，可以按位置读取”：

```python
products = ["tea", "cup", "spoon"]

print(products[0])
products.append("plate")
```

运行关系是：

```text
products -> list 对象

list 对象内部
  0 -> "tea"
  1 -> "cup"
  2 -> "spoon"
  3 -> "plate"
```

`append` 修改的是列表对象本身。名字 `products` 没有变，它仍然绑定到同一个列表对象；变化发生在这个列表对象内部的元素引用结构。

可变性带来组合能力，也带来共享副作用：

```python
products = ["tea"]
catalog = products

catalog.append("cup")
print(products)
```

输出是：

```text
['tea', 'cup']
```

原因是 `products` 和 `catalog` 绑定到同一个 `list` 对象。通过任意一个名字修改这个对象，另一个名字读取到的也是修改后的对象。

`list` 适合表达可变顺序，不适合表达唯一性边界。把标签放在列表中可以运行：

```python
tags = ["drink", "warm", "drink"]
```

但重复值没有被结构阻止。后续代码如果依赖“标签唯一”，就需要额外检查。结构没有表达出来的语义，最终会转移成隐藏约定。

## `tuple`：固定组合

`tuple` 也是序列，但官方教程明确说明它不可变，并指出它通常用于异构元素组合，常通过解包或索引访问；列表则通常用于同类元素，并通过迭代访问。[Python Tutorial: Data Structures][python-data-structures]

`tuple` 解决的是另一类组织压力：有些数据不是“会继续增长的一组项目”，而是“几个位置含义稳定的对象共同组成一个值”。这类数据需要整体传递，也需要能按位置拆开，但不需要在原对象上追加、删除或替换位置。坐标、日期片段、数据库行、函数返回的多个结果、字典键中的复合键，都属于这类压力。

如果只用 `list` 表达这类组合，代码可以运行，但结构会暗示“这组元素可能会被追加、删除、排序或替换”。这和固定记录的意图不一致。`tuple` 把意图收紧：位置数量和位置关系创建后不再改变，后续代码可以把它当作一个稳定组合来传递和解包。

例如函数需要返回两个结果：

```python
def split_price(cents):
    dollars = cents // 100
    remainder = cents % 100
    return dollars, remainder

whole, part = split_price(1299)
```

`return dollars, remainder` 返回的是一个元组。这里的重点不是“返回一个列表”，而是返回一个固定组合：第 0 位是美元整数部分，第 1 位是剩余分值。调用方用解包把两个位置分别绑定到名字。

元组也常用于复合键：

```python
stock = {
    ("tea", "small"): 12,
    ("tea", "large"): 5,
}

print(stock[("tea", "small")])
```

这里 `("tea", "small")` 作为一个整体表示“商品 + 规格”。它的两个位置共同确定一个键。`tuple` 不可变，适合作为这类稳定复合键；可变的 `list` 不能直接作为 `dict` 键。

元素指容器内部保存的对象引用所指向的对象。异构元素指同一个组合里的元素不只按同一种规则处理：它们可以是不同类型的对象，也可以类型相同但承担不同语义角色。商品价格记录就是一个例子：

```python
price = ("tea", 1299, "USD")
```

这个元组里的三个位置不是三件同类商品，而是一条记录的三个字段：

```text
第 0 位 -> sku，字符串对象 "tea"
第 1 位 -> cents，整数对象 1299
第 2 位 -> currency，字符串对象 "USD"
```

这里包含 `str`、`int`、`str`，类型并不完全相同；同时三个位置的语义角色也不同。类型不同通常就是异构组合，但异构组合不只由类型决定。位置语义不同，也会让一个元组更像固定记录：

```python
point = (10, 20)
```

`point` 的两个元素都是 `int` 对象，但第 0 位表示 `x` 坐标，第 1 位表示 `y` 坐标。它们类型相同，位置角色不同，所以仍然适合用元组表达一个固定组合。相对地：

```python
prices = [1299, 899, 1599]
```

这更像同构序列：每个元素都是价格分值，通常按同一种方式遍历和处理。

索引访问是按位置读取：

```python
sku = price[0]
cents = price[1]
currency = price[2]
```

解包是把元组中每个位置的对象一次性绑定到对应名字：

```python
sku, cents, currency = price
```

执行后，当前命名空间得到三条名字绑定：

```text
sku      -> "tea"
cents    -> int 对象 1299
currency -> "USD"
```

解包仍然延续对象模型：它不是把元组拆成文本，而是按位置取出元组内部保存的对象引用，再把这些对象绑定到左侧名字。

`tuple` 适合把几个位置含义稳定的对象合成一个整体：

```python
price = ("tea", 1299, "USD")
sku, cents, currency = price
```

运行关系是：

```text
price -> tuple 对象

tuple 对象内部
  0 -> "tea"
  1 -> int 对象 1299
  2 -> "USD"
```

这个结构表示：第 0 位是商品编号，第 1 位是价格，第 2 位是货币。`tuple` 的不可变性意味着不能通过 `price[1] = 999` 修改这个组合。它适合表示小而稳定的位置关系。

不可变的是元组对象的元素引用结构，不等于里面所有对象都不能变。官方教程给出过元组可以包含可变对象的情况。[Python Tutorial: Data Structures][python-data-structures]

```python
record = ("tea", ["drink", "warm"])
record[1].append("new")

print(record)
```

输出是：

```text
('tea', ['drink', 'warm', 'new'])
```

这里没有修改 `tuple` 的第 1 个位置指向哪个对象；修改的是第 1 个位置引用到的 `list` 对象内部状态。这再次说明：容器保存对象引用，容器自身的可变性和被引用对象的可变性是两件事。

## `dict`：键到值的映射

`dict` 表达映射关系。官方教程说明字典可以理解为 key:value 对的集合，键在一个字典内必须唯一；主要操作是按键存储值和按键取出值。[Python Tutorial: Data Structures][python-data-structures][Built-in Types: Mapping Types][python-mapping-types]

`dict` 解决的是“对象需要通过稳定标识找到另一个对象”的压力。许多数据不是靠第几个位置理解，而是靠字段名、编号、配置名、用户名、商品编号理解。商品的价格不应依赖“第 1 位就是价格”这种位置约定；配置中的数据库地址也不应依赖“列表第 3 项是 host”。这些场景需要把一个可查找的键和一个值对象连起来。

如果用 `tuple` 表达字段很多的记录，后续代码会充满 `record[0]`、`record[1]` 这样的数字索引，字段含义离代码越来越远。如果用 `list` 表达映射，就要自己规定偶数位是键、奇数位是值，或者写查找循环。如果用 `set`，只能表达成员是否存在，不能直接表达某个键对应哪个值。`dict` 把“通过键找值”变成结构本身。

这与第 01 章的命名空间有相似点：二者都包含“某个标识 -> 某个对象”的关系。但它们不在同一层：

```text
命名空间
  Python 语言执行模型中的名字 -> 对象映射。
  名字是源码标识符。

dict
  用户程序中的普通对象。
  键是对象，可以是字符串、数字、满足条件的元组等不可变对象。
```

商品记录适合用 `dict`：

```python
product = {
    "sku": "tea",
    "cents": 1299,
    "currency": "USD",
}

print(product["cents"])
```

运行关系是：

```text
product -> dict 对象

dict 对象内部
  "sku"      -> "tea"
  "cents"    -> int 对象 1299
  "currency" -> "USD"
```

这里的关键不是大括号语法，而是查找方式。后续代码不需要记住“价格在第几个位置”，而是通过稳定键 `"cents"` 找到对应对象。

字典的代价是键承担语义。键名如果混乱，结构也会混乱：

```python
product = {"price": 1299, "amount": 899}
```

`price` 和 `amount` 都能作为键，但它们是否表示同一种单位、是否都是分、是否包含税，结构本身没有说明。`dict` 解决按键查找，不自动解决领域命名。

## `set`：唯一性边界

`set` 表达唯一性。官方教程说明集合是无序且没有重复元素的集合，常用于成员测试和去重，也支持并集、交集、差集等集合运算。[Python Tutorial: Data Structures][python-data-structures][Built-in Types: Set Types][python-set-types]

`set` 解决的是“这组对象只关心是否出现过，不关心出现几次或第几个出现”的压力。标签、权限、已访问节点、去重后的用户名、两个集合的交集和差集，都属于这类问题。核心操作不是“取第 2 个”，而是“这个对象是否属于这组成员”“两个集合有没有共同成员”“哪些成员只在 A 中出现”。

如果用 `list` 表达唯一性，重复元素不会被结构阻止，成员测试也会变成顺序扫描语义。如果用 `dict`，可以把成员放进键里，但值会变成多余占位。如果用 `tuple`，位置关系会被误认为有意义。`set` 把唯一成员关系变成结构本身。

标签适合用 `set`：

```python
tags = {"drink", "warm", "drink"}

print(tags)
print("drink" in tags)
```

运行关系是：

```text
tags -> set 对象

set 对象内部
  成员 -> "drink"
  成员 -> "warm"
```

重复的 `"drink"` 不会形成两个成员。`set` 的结构直接表达“成员唯一”。这比在 `list` 里保存标签再额外约定“不要重复”更稳定。

`set` 的代价是没有位置含义。集合适合成员测试和去重，不适合表达用户看到的稳定顺序。如果顺序是业务含义的一部分，`list` 更合适；如果唯一性是核心含义，`set` 更合适。

## 结构选择如何影响程序

同一组数据可以有不同结构：

```python
products = [
    {"sku": "tea", "cents": 1299, "tags": {"drink", "warm"}},
    {"sku": "cup", "cents": 899, "tags": {"tool", "kitchen"}},
]
```

这段代码里有三层容器：

```text
products -> list 对象
  第 0 个元素 -> dict 对象，表示第一件商品
  第 1 个元素 -> dict 对象，表示第二件商品

每个 dict 对象
  "sku"   -> str 对象
  "cents" -> int 对象
  "tags"  -> set 对象

每个 set 对象
  成员 -> str 对象
```

外层用 `list`，因为商品目录是一组可遍历商品。每个商品用 `dict`，因为商品字段适合用稳定键查找。标签用 `set`，因为标签的核心关系是唯一成员，而不是第几个标签。

如果商品记录改成 `tuple`：

```python
products = [
    ("tea", 1299, {"drink", "warm"}),
    ("cup", 899, {"tool", "kitchen"}),
]
```

它仍然能运行，也更紧凑。但位置语义变强：第 0 位、第 1 位、第 2 位分别是什么，要靠外部约定保持一致。`dict` 把字段名放进数据结构；`tuple` 把字段意义留给位置约定。二者不是绝对优劣，而是表达不同关系。

## 失败模式

第一种失败模式是把名字当成容器元素。`products = [tea]` 保存的是名字 `tea` 当时找到的对象，不是保存名字本身。后续重新绑定 `tea` 不会自动更新列表。

第二种失败模式是忽略共享可变对象：

```python
tags = {"drink"}
product_a = {"sku": "tea", "tags": tags}
product_b = {"sku": "cup", "tags": tags}

product_a["tags"].add("sale")
print(product_b["tags"])
```

`product_a` 和 `product_b` 的 `"tags"` 键都引用同一个 `set` 对象。修改这个集合，通过两个商品都能看到。共享可变对象可以是有意设计，也可以是隐藏副作用。

第三种失败模式是选错结构。用 `list` 表示唯一集合，要额外处理重复；用 `set` 表示用户可见顺序，会丢掉位置语义；用 `tuple` 表示字段很多的记录，后续代码会充满索引数字；用 `dict` 表示简单固定位置，键名可能比数据本身更重。

第四种失败模式是把 CPython 实现当成 Python 语言规则。Python 语言层回答“代码可以依赖什么行为”：列表是可变序列，元组是不可变序列，字典是映射，集合是唯一成员集合。CPython 实现层回答“最常见解释器如何把这些行为做出来”：列表、字典、集合有具体 C 结构、对象引用和优化策略。

例如，Python 代码可以依赖 `list` 保持元素顺序，可以依赖 `dict` 按键查找值，可以依赖 `set` 去重和成员测试；这些是语言层和标准库文档承诺的行为。CPython 内部如何扩容列表、如何组织字典表、如何优化集合查找，是解释性能和内存现象的实现细节。实现细节有价值，但不能替代语言模型；学习本章时，先用语言层判断结构含义，再在需要解释性能、共享引用或内存行为时回到 CPython 实现层。

## 回看 Java 和 C++

Python 的内置容器延续它的运行时对象模型：容器是对象，元素是对象引用，结构选择发生在运行时。Java 和 C++ 也能表达列表、映射、集合和记录，但它们把更多约束放在静态类型、泛型、类、模板、内存布局或标准库抽象上。

Java 的 `List<T>`、`Map<K,V>`、`Set<T>` 会把元素类型写进泛型边界，服务提前检查和大型工程约束。C++ 的 `std::vector<T>`、`std::map<K,V>`、`std::set<T>` 还会更直接地牵涉值语义、对象生命周期、迭代器失效、内存布局和性能。Python 的 `list`、`dict`、`set` 更靠近运行时组合：同一个容器可以保存不同类型对象，但更多错误也会推迟到运行时暴露。

这不是谁有容器、谁没有容器的差异，而是容器服务的中心不同。Python 用容器延续对象模型和低启动成本；Java 用集合框架服务静态类型和平台工程；C++ 用标准库容器服务性能、生命周期和资源控制。

## 最小代码练习

创建 `catalog.py`：

```python
products = [
    {"sku": "tea", "cents": 1299, "tags": {"drink", "warm"}},
    {"sku": "cup", "cents": 899, "tags": {"tool", "kitchen"}},
]

def show_catalog(items):
    for product in items:
        print(product["sku"], product["cents"], sorted(product["tags"]))

show_catalog(products)
```

再加入这几行，观察共享可变对象：

```python
shared_tags = {"new"}

product_a = {"sku": "plate", "tags": shared_tags}
product_b = {"sku": "bowl", "tags": shared_tags}

product_a["tags"].add("sale")
print(product_b["tags"])
```

最后把商品记录改成元组：

```python
products_as_tuples = [
    ("tea", 1299, {"drink", "warm"}),
    ("cup", 899, {"tool", "kitchen"}),
]
```

比较这两种读取方式：

```python
first_product = products[0]
print(first_product["cents"])
first_tuple = products_as_tuples[0]
print(first_tuple[1])
```

## 反馈问题

1. 容器为什么仍然是对象，而不是对象模型之外的新机制？
2. 名字绑定和容器内部对象引用有什么区别？
3. `products = ["tea", "cup"]` 里，`products`、`"tea"`、`"cup"` 分别处在什么位置？
4. 为什么 `list` 适合商品目录外层，而 `set` 适合标签？
5. `tuple` 的不可变性限制的是元组内部的引用结构，还是它引用到的所有对象？
6. `dict` 和命名空间都像映射，它们为什么不是同一层概念？
7. 可变容器被多个名字或多个字典字段共同引用时，最容易出现什么失败模式？

## 本章小结

第 01 章说明 Python 运行时世界由对象、名字、命名空间和模块组织起来。第 02 章在这个基础上加入容器：

```text
对象是运行时实体
-> 容器也是对象
-> 容器保存其他对象的引用
-> 不同容器表达不同对象关系
-> list 表达可变顺序
-> tuple 表达固定组合
-> dict 表达 key -> value 映射
-> set 表达唯一性边界
```

数据结构不是语法清单。它们是 Python 让多个对象继续保持可组合、可查找、可传递、可测试的一组基础机制。结构选对，后续函数、模块、异常、类和类型提示都会更自然；结构选错，错误常常不会立刻出现，但程序含义会逐渐变模糊。

## Sources

- [Python Tutorial: Data Structures][python-data-structures]
- [Python Data Model][python-data-model]
- [Python Execution Model][python-execution-model]
- [Built-in Types][python-built-in-types]
- [Built-in Types: Sequence Types][python-sequence-types]
- [Built-in Types: Mapping Types][python-mapping-types]
- [Built-in Types: Set Types][python-set-types]
- [Python/C API: Objects, Types and Reference Counts][python-c-api-intro]
- [Python/C API: List Objects][python-c-api-list]
- [Python/C API: Tuple Objects][python-c-api-tuple]
- [Python/C API: Dictionary Objects][python-c-api-dict]
- [Python/C API: Set Objects][python-c-api-set]

[python-data-structures]: https://docs.python.org/3/tutorial/datastructures.html
[python-data-model]: https://docs.python.org/3/reference/datamodel.html
[python-execution-model]: https://docs.python.org/3/reference/executionmodel.html
[python-built-in-types]: https://docs.python.org/3/library/stdtypes.html
[python-sequence-types]: https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range
[python-mapping-types]: https://docs.python.org/3/library/stdtypes.html#mapping-types-dict
[python-set-types]: https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset
[python-c-api-intro]: https://docs.python.org/3/c-api/intro.html#objects-types-and-reference-counts
[python-c-api-list]: https://docs.python.org/3/c-api/list.html
[python-c-api-tuple]: https://docs.python.org/3/c-api/tuple.html
[python-c-api-dict]: https://docs.python.org/3/c-api/dict.html
[python-c-api-set]: https://docs.python.org/3/c-api/set.html
