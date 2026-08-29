# 05. Python 为什么同时用语法约束和协作约定维护可读性？

## 本章推理总览

第 01 章建立了对象、名字、命名空间和模块组成的运行链；第 02 章让多个对象通过容器形成关系；第 03 章把行为包装成函数对象；第 04 章再用模块、包和导入绑定把对象与函数分配到多文件边界中。程序至此已经能够运行、组合和扩展，但这些机制只保证对象能被找到、行为能被调用、名字能被隔离，并不自动保证后来阅读代码的人能迅速判断一段缩进属于哪个控制块、一个名字承担什么职责、一个依赖来自哪里、一次修改会影响哪条路径。代码跨越时间、作者和模块之后，成本不再只来自“能不能执行”，还来自“读者要重建多少隐藏关系才能安全修改”。

> 定义  
> PEP 指 Python Enhancement Proposal，即 Python 增强提案。不同 PEP 的权威不同：有些提出语言变化，有些记录流程、风格或设计偏好。PEP 20 是信息型文本，概括 Python 偏好的表达方向；PEP 8 是 Python 代码风格指南，用来提高可读性并帮助大量 Python 代码保持一致。[PEP 20][pep20][PEP 8][pep8]

所有语言都要让解析器正确识别程序结构，也要让人类读者看见同一结构，但这两个目标可以由不同路线承担。一条路线用花括号、`begin` / `end` 等显式定界符决定语句分组，把缩进留给作者自由安排；它让语法边界不依赖空白，却允许视觉缩进与真正分组发生分歧。另一条路线允许作者先用较自由的写法表达程序，再用格式化器、检查器或团队评审把空格、换行、逗号位置、括号布局、导入顺序和空行数量等表面差异统一起来；这能减少同一段逻辑因为个人书写习惯不同而产生的阅读摩擦，但工具只能整理已经写出来的形状，不能判断 `x` 应该叫 `product_id` 还是 `order_id`，不能决定一个函数是否应该同时承担改价格、发通知和写日志三件事，也不能替项目划分哪些职责应留在当前模块、哪些应该移到别的模块。

Python 把三类责任放在不同层。语言语法回答“哪些语句属于同一个控制块，源码能否被解析”；共享约定回答“名字、空白和导入怎样写，读者才能更快识别角色与来源”；作者、项目规则和已有函数/模块边界回答“这个名字是否准确、职责应放在哪里、兼容性是否允许修改”。前一层能够强制后一层无法违背的结构，却不能替后一层作出语义判断；后一层也不能用整齐外观修复前一层已经表达错的控制流。

第一层是解析器必须服从的块结构。

> 定义  
> 复合语句是由多个部分组成的语句，例如 `if`、`for`、`while`、`try`、`with`、`def` 和 `class`。Python 语言参考把复合语句看成由一个或多个分句组成，官方术语是 clause；每个分句都有一个以冒号结尾的开头部分，官方术语是 header；后面跟着一组受这个开头控制的语句，这组语句的正式名称是 suite。[Python Language Reference: Compound statements][python-compound-statements]

suite 有两种语法形态：可以是冒号后同一逻辑行上的一个或多个简单语句，也可以是换行后由 `INDENT` 开始、由 `DEDENT` 结束的一组缩进语句；只有后一种形态能够继续包含嵌套的复合语句。逻辑行指 Python 语法认为的一条完整语句；一条赋值、调用或返回语句即使因为括号换行写成多行，仍然可能只是一条逻辑行。词法分析器根据完整语句开始位置的行首缩进计算缩进层级，并在层级增减时产生 `INDENT` 与 `DEDENT` 标记，语法分析器再用这些标记确定 suite 的边界。[Python Language Reference: Indentation][python-indentation][Python Language Reference: Implicit line joining][python-line-joining]

缩进不是“块已经由别的符号分好以后再画出的外观”，而是块结构的输入。Python 官方 FAQ 给出的核心理由正是让解析器看到的分组与读者从版面看到的分组不再由两套可能冲突的信号表达。[Python Design FAQ: Indentation][python-indentation-faq] 这项选择减少了花括号位置风格和错误视觉缩进造成的歧义，代价是空白不再完全中性：少缩进或多缩进可能改变执行路径或触发 `IndentationError`，制表符与空格以依赖制表宽度的方式混用时会触发 `TabError`，深层嵌套也会直接变成向右扩张的视觉成本。[Python Language Reference: Indentation][python-indentation]

第二层是共享约定。共享约定指 Python 社区和项目成员共同理解的源码信号；它们多数不是语法强制规则，违反它们时程序可能仍然能运行，但读者会失去一部分默认预期，需要花更多力气判断这个名字、空白或导入布局到底想表达什么。普通名字的大小写与分词方式通常不会改变绑定对象的行为；`total_cents`、`totalCents` 或 `x` 都可以绑定到同一个整数或函数对象。PEP 8 的命名约定服务的是识别速度：模块和包通常使用简短的小写名字，函数与变量通常使用 `lower_case_with_underscores`，类通常使用 `CapWords`，模块级常量通常使用 `UPPER_CASE_WITH_UNDERSCORES`。[PEP 8: Naming Conventions][pep8]

但 Python 的“约定”不能粗略理解成一层只影响外观的装饰。更准确的分类是：一部分是纯协作约定，例如 `snake_case`、空行和多数导入分组，解释器通常不关心它们；一部分是语义交界约定，人的命名信号会被导入机制、编译器或词法规则在特定位置识别，例如 `_name`、文档字符串和 `from __future__`；还有一部分是语言协议约定，形如 `__len__`、`__iter__`、`__enter__` 的系统定义名称会被语法、内置函数或标准库协议调用。各个特殊方法协议如何工作，属于后续对象模型和资源管理章节；本章只用双端双下划线说明“不要自行发明系统保留名称”这一边界。

文档字符串的英文术语是 docstring，指放在模块、类或函数开头、用来说明这个对象用途的字符串字面量。它看起来像普通字符串，但模块、类或函数 suite 中作为第一条语句出现时，会被编译器识别为 docstring，并存入相应对象的 `__doc__` 属性；如果同样的字符串出现在后面，它通常只是一个表达式语句，运行后结果被丢弃，不再成为对象文档。[Python Glossary: docstring][python-docstring][PEP 257][pep257] `from __future__ import ...` 更进一步。future 语句指一种写成导入形式、但会给编译器发出指令的语句：当前模块要使用某个未来 Python 版本才会成为标准的语法或语义。它的用途是让不兼容的语言变化可以逐个模块迁移；旧代码默认继续按旧规则运行，新代码或已迁移模块可以提前选择新规则。[Python Language Reference: Future statements][python-future][PEP 236][pep236] 它必须出现在模块开头附近，前面只能有模块 docstring、注释、空行或其他 future 语句，因为编译器需要在解析和生成代码之前知道这个模块采用哪套语法或语义选项，不能等运行到一半再决定。[Python Language Reference: Future statements][python-future]

第三层处理语法和统一格式都无法回答的语义问题。解析器能确定一个 `if` 控制哪些语句，却不能判断这个分支是否表达了正确业务规则；PEP 8 能建议把函数写成 `calculate_discount()`，却不能判断它是否还在暗中修改库存；导入可以被整齐分组，仍然可能存在方向错误的模块依赖。这里需要重新使用第 03 章的函数边界和第 04 章的模块边界：名字要对应稳定概念，函数要让参数、返回值和副作用可追踪，模块要让职责与依赖方向清楚，项目规则还要决定公共接口、兼容性和本地一致性。

PEP 20、PEP 8、语言参考和项目工具在这里承担不同权威。语言参考规定哪些缩进会改变词法标记和语句分组；违反这些规则会改变程序或使源码无法解析。PEP 20 提供判断方向，但不是可机械裁决所有代码的完整规范。PEP 8 主要给 Python 标准库源码提供编码约定，并明确允许项目采用自己的风格指南；发生冲突时，项目规则优先，而且项目内部、模块内部或函数内部的一致性比脱离语境追求统一更重要，不能为了符合风格建议而破坏向后兼容。[PEP 20][pep20][PEP 8][pep8]

这套分层答案的失败模式来自把不同层混为一谈。把四格缩进说成解释器唯一接受的语法，会混淆约定与词法规则；把 `_name` 说成真正私有，会混淆公共接口约定与可访问性；把 docstring 当作任意位置的字符串注释，会错过编译器只识别第一语句的边界；把普通导入顶部约定和 future 语句的强制位置规则混成一类，会低估编译期语义的特殊性；把“代码能运行”当作“缩进和续行一定易读”，会忽略语法正确但视觉层次仍然含混的写法；把通过格式检查当作可维护性证明，会让含糊命名、过深嵌套、隐藏副作用和错误模块职责披上整齐外观。

Python、Java 和 C++ 面对的是同一个语句分组问题，但把权威信号放在不同位置。Java 语言规范把 block 定义为花括号中的语句与局部声明序列；C++ 标准草案把 compound statement 定义为用 `{` 与 `}` 把一组语句组合成一个语句。[Java Language Specification: Blocks][jls-blocks][C++ Draft: Compound statement][cpp-blocks] 在这两门语言中，花括号决定语法分组，缩进主要帮助读者，所以错误缩进可以与解析结果并存；在 Python 中，行首缩进直接参与生成块结构标记，读者和解析器共享同一主信号。三门语言都仍然需要命名和版面约定，因为无论块由缩进还是花括号确定，语法都无法独自说明一个名字是否准确、一个函数是否承担单一职责、一个模块依赖是否清楚。

## 代码变长以后，可读性不再只是外观

前四章建立的是“程序如何运行起来”的骨架。表达式产生对象，名字让代码找到对象，容器组织多个对象，函数把行为变成可调用对象，模块和包把对象与函数放进多文件边界。到这里，Python 程序已经能从一个脚本长成一个小项目。

但项目变长以后，新的成本出现了。读者不只要知道代码会不会执行，还要知道每段代码属于哪个控制块、每个名字大概扮演什么角色、每个依赖来自哪里、修改一个函数是否会牵动另一个模块。这里的“依赖”主要指当前模块完成工作时需要借助的外部名字、模块、包或库，最常见的形式就是 `import os`、`import requests`、`from catalog.pricing import calculate_discount` 这类导入；它也包括读者要判断某个名字是当前模块内部定义，还是来自标准库、第三方库或本项目其他模块。可读性在这里不是“漂亮排版”，而是让后来的读者能更快、更可靠地重建程序结构。

PEP 20，也就是 “The Zen of Python”，用一组短句概括 Python 的设计偏好。与本章最相关的是：显式优于隐式，简单优于复杂，扁平优于嵌套，可读性很重要，命名空间是一个值得重视的好主意。[PEP 20][pep20] 这些句子不是语法规则，却说明 Python 倾向于让控制结构、名字来源和模块边界尽量可见，而不是把读者需要判断的关系藏在隐含约定里。PEP 8 则把这个偏好落到协作层面：代码读得比写得多，风格指南是为了提高可读性，并让大量 Python 代码保持一致。[PEP 8][pep8]

不过，可读性不能由单一机制完成。语言可以强制块结构，风格可以统一外观，项目可以规定公共接口，但没有一个规则能替作者判断业务名字是否准确、函数是否承担太多职责、模块边界是否放在了正确位置。Python 的答案是分层：少数直接决定控制结构的可见形式进入语言语法；不改变对象行为的命名、空白和导入布局主要由共享约定稳定；约定无法替代的语义表达仍由作者判断、函数边界、模块边界和项目规则承担。

## 语法层：缩进是块结构的输入

> 定义  
> 块结构指一组语句在控制流里属于谁。

下面这段代码里，`discount = 20` 和 `total = price - discount` 属于 `if price > 100:` 控制的区域；`print(total)` 回到了外层：

```python
price = 120

if price > 100:
    discount = 20
    total = price - discount

print(total)
```

Python 不是先用花括号或 `end` 把块分好，再把缩进当成装饰。Python 的词法分析器会读取每条完整语句开头的前导空白，根据缩进层级的增加和减少产生 `INDENT` 与 `DEDENT` 标记；后面的语法分析再用这些标记确定 suite 边界。[Python Language Reference: Indentation][python-indentation]

`INDENT` 和 `DEDENT` 是词法标记。词法标记可以理解为解释器把源码拆开后交给语法分析器的结构信号。缩进变深时产生 `INDENT`，缩进回退时产生 `DEDENT`。所以这段代码的结构可以读成：

```text
if price > 100:
INDENT
    discount = 20
    total = price - discount
DEDENT
print(total)
```

这解释了为什么下面两段代码不是同一件事：

```python
if price > 100:
    discount = 20
    total = price - discount
```

```python
if price > 100:
    discount = 20
total = price - discount
```

第二段里的 `total = price - discount` 不再属于 `if` 的 suite。缩进不是外观变化，而是控制流变化。

> 解释  
> 这一点是本章区分语法和风格的核心：缩进在 Python 中参与生成块结构，因此它会改变解释器看到的程序；四个空格、空行和许多命名风格主要服务协作阅读，通常不会改变对象绑定或控制流。

## clause、header 和 suite

复合语句是由多个部分组成的语句。`if`、`for`、`while`、`try`、`with`、`def` 和 `class` 都是复合语句。Python 语言参考把复合语句拆成一个或多个分句，官方术语是 clause。[Python Language Reference: Compound statements][python-compound-statements]

一条 `if` 语句可以包含三个分句：

```python
if price > 100:
    discount = 20
elif price > 50:
    discount = 10
else:
    discount = 0
```

这里的三个分句分别是：

```text
if price > 100:
    discount = 20

elif price > 50:
    discount = 10

else:
    discount = 0
```

每个分句都有两部分。`header` 是以冒号结尾的开头部分，例如 `if price > 100:`。`suite` 是受这个 header 控制的一组语句，例如 `discount = 20`。

suite 有两种写法。第一种是同一逻辑行上的简单语句：

```python
if price > 100: discount = 20
```

这种写法合法，但不适合承载复杂逻辑。它的 suite 只能是简单语句，不能在同一行里继续嵌套新的复合语句。

第二种是多行缩进 suite：

```python
if price > 100:
    discount = 20
    total = price - discount
```

多行 suite 用 `INDENT` 开始，用 `DEDENT` 结束，并且可以继续包含嵌套的 `if`、`for`、`try` 等复合语句。这也是 Python 代码里最常见、最清楚的块结构。

## 逻辑行和续行对齐不是一回事

逻辑行是 Python 语法认为的一条完整语句；物理行是文件里肉眼看到的一行。一个逻辑行可以跨多个物理行。

```python
total = (
    price
    + tax
    - discount
)
```

这段代码占了五个物理行，但它是一条逻辑行：给 `total` 赋值。括号里的换行来自 Python 的隐式续行规则：圆括号、方括号和花括号内部可以换行，不需要反斜杠。[Python Language Reference: Implicit line joining][python-line-joining]

因此，括号里的缩进不是块缩进：

```python
if price > 100:
    total = (
        price
        - 20
    )
```

这段代码里有两类空白。`total = (` 前面的四个空格是完整语句开始位置的行首缩进，它说明这条赋值语句属于 `if` 的 suite。`price` 和 `- 20` 前面的空格只是括号内部的续行对齐，它们仍然属于同一条赋值语句内部，不会打开新的 suite。

所以，“Python 用缩进表示块”不等于“所有看起来缩进去的行都创建新块”。只有完整语句开始位置的行首缩进参与块结构判断。括号、方括号或花括号内部为了换行和对齐而增加的空白，服务的是表达式可读性，不是控制流分组。

PEP 8 建议每级缩进使用四个空格，官方教程也推荐四个空格且不使用制表符。[PEP 8][pep8][Python Tutorial: Coding Style][python-coding-style] 但语言规则本身不是“只接受四个空格”。真正的语言要求是缩进层级必须一致，不能用导致含义依赖制表宽度的方式混用制表符和空格。[Python Language Reference: Indentation][python-indentation]

## 共享约定：让读者共享默认预期

> 定义  
> 共享约定不是某个作者临时发明的个人习惯，而是 Python 社区和项目成员共同理解的源码信号。它们多数不决定代码能否运行，但会决定读者能否快速建立预期。

例如：

```python
def calculate_discount(price):
    return price * 0.1


class PriceRule:
    pass


MAX_RETRY_COUNT = 3
```

大多数 Python 读者看到 `calculate_discount`，会预期它是函数或普通变量；看到 `PriceRule`，会预期它是类；看到 `MAX_RETRY_COUNT`，会预期它是模块级常量。解释器不会因为函数写成 `CalculateDiscount` 就拒绝运行，也不会因为类写成 `price_rule` 就自动改变对象行为。命名形状服务的是读者的识别速度。[PEP 8][pep8]

这类约定的边界也很重要：

```python
def process_data(x):
    update_price(x)
    send_receipt(x)
    write_audit_log(x)
```

`process_data` 符合函数命名风格，但它没有告诉读者 `x` 是订单、商品还是用户，也没有说明这个函数为什么同时改价格、发通知和写日志。命名风格只能降低重复识别成本，不能替代领域含义。准确名字仍然要来自作者对业务概念和函数职责的判断。

## 下划线：同一种字符，不同层的信号

下划线名称最容易暴露“约定不是纯外观”这一点。同样是 `_`，它可能只是协作信号，也可能被导入规则、类定义规则或模式匹配规则识别。

单个前导下划线，例如 `_discount_table`，通常表示非公开接口：

```python
_discount_table = {
    "VIP": 0.2,
    "REGULAR": 0.1,
}
```

“非公开”在这里是协作约定，不是访问控制。外部代码仍然能显式访问：

```python
import pricing

print(pricing._discount_table)
```

外部代码也能显式导入：

```python
from pricing import _discount_table
```

但通配导入有特殊规则。通配导入指 `from pricing import *`。如果模块没有定义 `__all__`，这种导入默认不会导入以下划线开头的名字；如果模块定义了 `__all__`，那就由 `__all__` 明确列出的名字决定公共导出集合。[Python Language Reference: The import statement][python-import-statement]

```python
# pricing.py
_discount_table = {"VIP": 0.2}
PUBLIC_RATE = 0.1

# demo.py
from pricing import *

print(PUBLIC_RATE)
print(_discount_table)  # NameError
```

这说明 `_discount_table` 不是“无法访问”，而是“默认不出现在通配导入的公共名字集合里”。它同时是协作约定和导入机制的交界。

单个尾随下划线，例如 `class_`，通常用于避免与关键字冲突：

```python
def find_items(class_):
    return class_
```

这里的下划线没有特殊语义，只是把本来想用的名字 `class` 避开，因为 `class` 是 Python 关键字。

双前导下划线，例如 `__discount`，只在类定义内部有特殊规则。private name mangling 可以译作“私有名字改写”。在类体内部，形如 `__discount` 这种以两个下划线开头、但不以两个下划线结尾的名字，会被 Python 改写成带类名的形式。[Python Tutorial: Private Variables][python-private-variables]

```python
class PriceRule:
    def __init__(self):
        self.__discount = 20
```

这个属性会被改写成类似：

```text
_PriceRule__discount
```

这样做不是为了提供 Java `private` 那样的访问控制，而是为了减少父类和子类意外撞名：

```python
class PriceRule:
    def __init__(self):
        self.__discount = 20


class HolidayPriceRule(PriceRule):
    def __init__(self):
        super().__init__()
        self.__discount = 50
```

父类里的 `__discount` 会变成类似 `_PriceRule__discount`，子类里的 `__discount` 会变成类似 `_HolidayPriceRule__discount`。两个名字不容易互相覆盖。但外部代码仍然可以通过改写后的名字访问它，所以它不是不可绕过的私有变量。

双端双下划线，例如 `__len__`、`__iter__`、`__enter__`，属于系统定义名称形态。Python 语言参考把这类形式保留给系统定义名称；代码应当按已经记录的协议使用它们，不应自行发明新的 `__something__` 名字。[Python Language Reference: Reserved classes of identifiers][python-reserved-identifiers]

单独的 `_` 还要按场景区分。在 `match` 的模式位置，它是通配符，匹配任意值但不绑定名字：

```python
def describe_status(status):
    match status:
        case 200:
            return "ok"
        case _:
            return "other"
```

官方教程也用 `case _` 展示 `match` 的兜底模式。[Python Tutorial: match Statements][python-match-statements] 这里的 `_` 不是读取变量，而是“其他任何值都可以匹配”。

在交互解释器中，`_` 通常指向上一次表达式结果。[Python Tutorial: Using Python as a Calculator][python-calculator]

```python
>>> 10 + 5
15
>>> _
15
```

在普通赋值、循环变量或解包位置，`_` 仍然是会被绑定的普通标识符，只是程序员常用它表示“这个值不会被使用”：

```python
for _ in range(3):
    print("hello")

name, _ = ("Alice", 30)
```

这组例子说明：不能把“下划线命名”统一解释成“私有变量”。它横跨协作约定、导入规则、类内名字改写、系统协议和模式匹配规则。

## 空白和空行：显示结构，不创造结构

空白约定的作用，是让表达式和参数边界更容易扫描。

```python
total=price+tax-discount
```

这段代码能运行，但符号挤在一起，读者要自己拆出赋值、加法和减法关系。PEP 8 建议二元运算符两侧通常留空格：[PEP 8][pep8]

```python
total = price + tax - discount
```

参数边界也是同理：

```python
calculate_discount(product,price,rate)
```

逗号后没有空格时，三个参数贴在一起。更常见的写法是：

```python
calculate_discount(product, price, rate)
```

但空格也不是越多越好：

```python
calculate_discount( product, price, rate )
```

括号内侧额外塞空格没有显示新的结构，只会打断读者对函数名、参数列表和调用关系的识别。更清楚的写法是：

```python
calculate_discount(product, price, rate)
```

普通赋值、函数定义中的默认参数、函数调用中的关键字实参也有不同约定。普通赋值的 `=` 是语句里的主要绑定关系，通常两侧留空格：

```python
amount = 100
total = price + tax
```

函数调用里的关键字实参不是普通赋值语句，而是在调用函数时把一个值传给指定参数：

```python
format_price(amount=100, currency="CNY")
```

这里的意思是把 `100` 传给 `amount` 参数，把 `"CNY"` 传给 `currency` 参数。`amount=100` 是一个紧凑的参数单元，所以 PEP 8 通常不建议写成 `amount = 100`。

函数定义里的默认参数如果没有类型标注，通常也不在 `=` 两侧留空格：

```python
def format_price(amount=100, currency="CNY"):
    return f"{currency} {amount}"
```

但函数定义里的默认参数如果带类型标注，PEP 8 建议在 `=` 两侧留空格：

```python
def calculate_discount(price: int = 100):
    return price * 0.1
```

这里同时有两层关系：`price: int` 说明 `price` 的类型标注是 `int`，`= 100` 说明默认值是 `100`。空格让类型标注和默认值关系更清楚。

这些空白多数时候不改变对象绑定或调用语义，却改变读者识别表达式关系和参数边界的速度。

空行和导入分组也是同一个原则：显示已有结构，不创造新的运行时边界。导入分组可以把依赖来源显示出来：

```python
import os

import requests

from catalog.pricing import calculate_discount
```

这三组分别是标准库、第三方库和本项目代码。读者看到 `os`，会把它当成 Python 自带能力；看到 `requests`，会把它当成安装进环境的第三方库；看到 `catalog.pricing`，会知道它来自本项目，修改时要回到项目源码里查找调用关系。如果一个名字没有来自导入，而是在当前模块中由 `def`、`class` 或赋值产生，读者又会把它理解为当前模块自己的局部职责。导入分组不会改变 `import` 的语言行为。第 04 章已经说明，导入的核心行为是搜索、加载或复用模块对象，并在当前命名空间绑定名字。把 `os`、`requests` 和 `catalog.pricing` 分成三组，不会改变 `sys.modules` 缓存、模块顶层执行或名字绑定规则；它只是把依赖来源和修改风险放在读者容易扫描的位置。[Python Language Reference: The import statement][python-import-statement]

空行也不会创建函数对象、模块对象或命名空间。函数边界本来由 `def` 执行后产生的函数对象和名字绑定形成，模块边界本来由文件执行、模块对象和导入系统形成。空行只是把这些已有边界显示出来。

下面这段代码里的空行甚至可能制造一种虚假的清楚：

```python
def process_order(order):
    validate(order)

    charge(order)

    send_receipt(order)

    update_inventory(order)
```

它看起来分了四段，但函数仍然同时承担校验、扣款、通知和库存修改。空行没有产生新的函数边界、错误处理边界或模块边界。若这些职责需要分离，真正的修改应当是提取函数、调整返回值和副作用、重新安排模块依赖，或者在兼容性约束下保留现状并补足测试。排版只能让混合职责看起来更整齐，不能把混合职责变成清晰设计。

## docstring 和 future：文件开头不总是普通约定

同样是“放在文件开头”，普通导入分组、文档字符串和 future 语句的权威不同。

文档字符串是对象文档入口。

> 定义  
> 文档字符串的英文术语是 docstring，指放在模块、类或函数 suite 开头、用来说明这个对象用途的字符串字面量。它作为第一条语句出现时会被识别为对象文档，并存入相应对象的 `__doc__` 属性。

它用字符串字面量写成，常见形式是三引号字符串：

```python
def calculate_discount(price):
    """Return the discount amount for a product price."""
    return price * 0.1
```

这段字符串是函数体的第一条语句，所以 Python 会把它识别为函数对象的文档字符串，并存到 `calculate_discount.__doc__`：

```python
print(calculate_discount.__doc__)
```

如果字符串不是第一条语句，就不会成为这个函数的 docstring：

```python
def calculate_discount(price):
    rate = 0.1
    """Return the discount amount for a product price."""
    return price * rate
```

第二段里的字符串通常只是一个表达式语句。它的值没有被保存给名字，也没有作为返回值交出去，执行后结果被丢弃。工具可能仍然按自己的规则提取某些字符串，但语言层的 docstring 入口是“第一条语句”。[Python Glossary: docstring][python-docstring][PEP 257][pep257]

future 语句是另一类特殊机制。

> 定义  
> future 语句是一种写成导入形式、但会给编译器发出指令的语句：当前模块要使用某个未来 Python 版本才会成为标准的语法或语义。[Python Language Reference: Future statements][python-future]

它的形式是：

```python
from __future__ import feature
```

这里的 `future` 不是“未来要导入一个普通库”的意思，而是“当前模块选择启用某个未来版本才会成为标准的语言特性”。

它解决的是语言演进中的兼容问题。Python 偶尔需要改变核心语法或语义；这些变化长期看会让语言更好，但短期内可能破坏旧代码。PEP 236 给出的方案是：引入变化的版本先不默认改变所有模块；需要迁移的模块可以写 `from __future__ import ...` 提前采用新规则；等到后续版本中这个特性成为标准后，旧代码再逐步迁移。[PEP 236][pep236] 这就是它叫 `__future__` 的原因：它让当前模块提前按“未来标准规则”编译。

> 解释  
> future 语句虽然写成导入形式，但它的关键作用发生在编译阶段。编译器必须在生成代码前知道当前模块采用哪套语法或语义规则，所以 future 语句的位置属于语言规则，不是普通导入分组风格。

“导入谁”也要分清。`__future__` 不是来自某个还不存在的未来 Python，而是当前 Python 安装里已经存在的标准库模块。它像一张登记表，列出解释器认识的 future 特性，例如这个特性从哪个版本开始可以选择启用、将来从哪个版本开始成为默认规则，以及编译器内部要打开哪个标志。[Python `__future__` module][python-future-module] 所以代码现在就能导入它：导入的是当前解释器自带的 `__future__` 模块；所谓“future”指的是被登记的语言行为原本属于未来默认规则，而不是模块文件来自未来。

> 定义  
> 默认规则指一个模块没有写额外声明时，解释器自动采用的语言规则。

历史上的 `division` 是一个清楚例子。在 Python 2 的迁移期，没有 future 语句的模块默认采用旧除法规则：两个整数相除时，`1 / 2` 得到 `0`。写了 `from __future__ import division` 的模块则提前采用未来规则：`/` 表示真除法，`1 / 2` 得到 `0.5`；需要向下取整时改用 `//`。到 Python 3 以后，真除法成为默认规则，所以普通 Python 3 模块不写 future 语句，`1 / 2` 也会得到 `0.5`。[PEP 238][pep238] 这个例子说明，“未来会变成默认规则”不是说代码现在不存在，而是说同一条源码在迁移期需要一个显式开关，等语言完成迁移后，这个开关代表的行为就成为普通默认行为。

它看起来像导入，但不是普通依赖整理。普通导入是在运行时搜索、加载或复用模块对象；future 语句的直接运行时行为仍然像导入 `__future__` 模块，但真正关键的部分发生在编译期。编译器可能需要为同一段源码生成不同代码，也可能需要先知道某个新关键字或新语法是否有效；这种决定不能等程序运行到那一行以后再做。[Python Language Reference: Future statements][python-future][Python `__future__` module][python-future-module]

所以，下面的结构是允许的：

```python
"""Pricing helpers."""

from __future__ import annotations

import os
```

但普通语句出现在 future 语句之前就不行：

```python
version = "1.0"

from __future__ import annotations
```

这里的问题不是导入分组不美观，而是 future 语句的位置违反语言规则。它必须在模块开头附近出现，前面只能有模块 docstring、注释、空行或其他 future 语句；如果前面已经有普通赋值、普通导入或函数定义，编译器就不能把后面的 future 语句当成“本模块编译规则”的提前声明。[Python Language Reference: Future statements][python-future]

这个设计让已有工具仍然能把它看成导入语句处理，也让这些语言演进信息能被程序检查。[Python `__future__` module][python-future-module] 因此，普通导入顶部约定主要服务扫描；docstring 的第一语句位置会影响对象的 `__doc__`；future 语句的位置会影响源码能否按预期编译。三者同在文件开头附近，却属于不同权威层。

## 语法和格式都不能替代语义判断

格式检查通过，只能说明代码符合某些选中的外观规则。它不能证明名字准确、函数职责清楚、模块依赖方向正确。

```python
def calculate_discount(order):
    order.total = order.total * 0.9
    update_inventory(order)
    send_receipt(order.customer_email)
    return order.total
```

这个函数名看起来像“计算折扣”，但函数实际做了四件事：修改订单金额、更新库存、发送收据、返回金额。缩进正确，空格正确，名字也像函数名，但语义仍然不清楚。读者会追问：

```text
calculate_discount 是否应该修改 order？
更新库存为什么在折扣函数里？
发送收据失败时，金额修改是否要回滚？
这个函数属于 pricing 模块、orders 模块，还是 notification 模块？
```

这些问题不由 PEP 8 自动回答，也不由解析器回答。它们要回到第 03 章的函数边界和第 04 章的模块边界：函数应让参数、返回值和副作用可追踪；模块应让职责和依赖方向清楚；项目规则应决定哪些名字属于公共接口，哪些修改会破坏兼容性。

这也是 Python 没有把所有可读性问题都升级成语法错误的原因。语法能强制块结构，却不能强制业务概念准确。共享约定能压低协作摩擦，却不能替代码作者做领域判断。工具能统一一部分外观，却不能把一个职责纠缠的函数自动变成清楚的模块设计。

## PEP、语言参考和项目规则的权威边界

语言参考是语法和语义的事实边界。缩进层级如何产生 `INDENT` / `DEDENT`，suite 如何组成，future 语句放在哪里，通配导入如何处理下划线名字，都由语言参考规定。[Python Language Reference: Indentation][python-indentation][Python Language Reference: Compound statements][python-compound-statements][Python Language Reference: Future statements][python-future][Python Language Reference: The import statement][python-import-statement]

PEP 20 是信息型文本，提供 Python 偏好的判断方向。它说明 Python 重视可读、显式、简单和命名空间，但不负责机械裁决每一处具体代码。[PEP 20][pep20]

PEP 8 是风格指南。它主要给 Python 标准库源码提供编码约定，也明确说明许多项目会有自己的风格指南，发生冲突时项目规则优先；一致性很重要，但项目内部、模块内部或函数内部的一致性更重要，而且不能为了符合风格建议而破坏向后兼容。[PEP 8][pep8]

格式化器和检查器处在更外层。它们可以把项目选中的一部分约定变成自动反馈，例如统一空格、换行、导入排序和行宽。但工具只是执行约定，不会把约定变成 Python 语言语义，也不能证明业务行为已经清楚。

## 与 Java、C++ 的比较：块边界由谁决定

Python、Java 和 C++ 都要回答同一个问题：一组语句如何归属于一个控制结构。

Java 的 block 由花括号包围。语言规范把 block 定义为花括号中的语句和局部声明序列。[Java Language Specification: Blocks][jls-blocks]

```java
if (price > 100) {
    discount = 20;
    total = price - discount;
}
```

C++ 的 compound statement 也是由 `{` 与 `}` 组合一组语句。[C++ Draft: Compound statement][cpp-blocks]

```cpp
if (price > 100) {
    discount = 20;
    total = price - discount;
}
```

在这两门语言里，花括号决定语法分组，缩进主要帮助读者。因此，错误缩进可以和正确解析结果并存：

```java
if (price > 100) {
    discount = 20;
}
    total = price - discount;
```

`total = price - discount;` 看起来缩进了，但语法上不在花括号里。

Python 把主信号换成行首缩进：

```python
if price > 100:
    discount = 20
total = price - discount
```

这里 `total = price - discount` 回到外层，读者看到的缩进和解析器使用的缩进是同一主信号。Python 因此减少了花括号布局风格和视觉缩进冲突，但也付出空白纪律的代价：缩进错误不再只是“不好看”，而可能改变程序结构或直接让源码无法解析。

三门语言都仍然需要命名和版面约定。无论块由缩进还是花括号决定，语法都无法独自说明 `x` 是什么业务对象、`process_order` 是否承担过多职责、`pricing` 模块是否应该依赖通知模块。块结构只是可读性的第一层，不是全部。

## 最小代码练习

创建 `catalog/pricing.py`：

```python
"""Pricing helpers for catalog examples."""

from __future__ import annotations

_discount_table = {
    "VIP": 0.2,
    "REGULAR": 0.1,
}

PUBLIC_RATE = 0.1


def calculate_discount(price: int = 100, *, customer_type="REGULAR"):
    rate = _discount_table.get(customer_type, PUBLIC_RATE)
    return price * rate


class PriceRule:
    def __init__(self):
        self.__discount = 20
```

创建 `check_readability.py`：

```python
from catalog.pricing import *

import catalog.pricing as pricing


def show_imports():
    print(PUBLIC_RATE)
    print(hasattr(pricing, "_discount_table"))
    print("_discount_table" in globals())


def show_names():
    rule = pricing.PriceRule()
    print(hasattr(rule, "__discount"))
    print(hasattr(rule, "_PriceRule__discount"))


def show_underscore():
    for _ in range(2):
        print("loop")

    name, _ = ("Alice", 30)
    print(name)

    status = 404
    match status:
        case 200:
            print("ok")
        case _:
            print("other")


show_imports()
show_names()
show_underscore()
```

运行：

```shell
python check_readability.py
```

观察四件事：

```text
_discount_table 能通过 pricing._discount_table 访问吗？
from catalog.pricing import * 会不会默认导入 _discount_table？
PriceRule 实例上能直接找到 __discount 吗？能找到 _PriceRule__discount 吗？
for _、name, _ 和 case _ 中的单独下划线分别是什么含义？
```

再做两个小改动：

```text
把 catalog/pricing.py 顶部的 docstring 移到 import 后面，观察 __doc__ 是否变化。
把 from __future__ import annotations 移到普通赋值后面，观察 Python 是否接受。
```

最后，找一个能运行但难读的函数，只允许做三类修改并说明理由：

```text
改名：让名字对应稳定概念。
提取函数：让参数、返回值和副作用更清楚。
移动模块：让依赖来源和职责边界更清楚。
```

## 反馈问题

1. suite 是什么？它和 header、clause 的关系是什么？
2. 为什么括号内部的续行缩进不会创建新的 suite？
3. 四个空格是语言语法要求，还是共享约定？
4. `_name` 为什么不是不可访问的私有变量？
5. `__name` 的 private name mangling 解决什么问题，又不解决什么问题？
6. 单独 `_` 在 `match`、交互解释器和普通赋值里分别是什么意思？
7. docstring 为什么必须放在模块、类或函数 suite 的第一条语句位置？
8. `from __future__ import ...` 为什么不能按普通导入分组随意移动？
9. 为什么格式化器能统一空白，却不能替作者决定函数职责和模块边界？

## 本章小结

Python 的可读性不是一组外观偏好，而是一套分层设计：

```text
语言语法
  用缩进、INDENT、DEDENT 和 suite 强制控制结构可见。

共享约定
  用命名形状、下划线信号、空白、空行和导入布局降低协作摩擦。

语义判断
  用准确名字、函数边界、模块边界、公共接口和兼容性规则处理工具无法决定的问题。
```

缩进直接参与块结构，所以它不是装饰。四个空格、命名风格、空行和导入分组主要是共享约定，所以它们帮助读者建立预期，但不自动改变对象行为。下划线、docstring 和 future 语句处在约定与语言机制的交界，必须按具体位置判断。格式工具可以整理形状，却不能替代语义设计。

## Sources

- [PEP 20: The Zen of Python][pep20]
- [PEP 8: Style Guide for Python Code][pep8]
- [Python Language Reference: Indentation][python-indentation]
- [Python Language Reference: Implicit line joining][python-line-joining]
- [Python Language Reference: Compound statements][python-compound-statements]
- [Python Language Reference: The import statement][python-import-statement]
- [Python Language Reference: Reserved classes of identifiers][python-reserved-identifiers]
- [Python Tutorial: match Statements][python-match-statements]
- [Python Tutorial: Using Python as a Calculator][python-calculator]
- [Python Glossary: docstring][python-docstring]
- [PEP 257: Docstring Conventions][pep257]
- [Python Language Reference: Future statements][python-future]
- [Python `__future__` module][python-future-module]
- [PEP 236: Back to the __future__][pep236]
- [PEP 238: Changing the Division Operator][pep238]
- [Python Tutorial: Intermezzo — Coding Style][python-coding-style]
- [Python Tutorial: Private Variables][python-private-variables]
- [Python Design FAQ: Why does Python use indentation for grouping of statements?][python-indentation-faq]
- [Java Language Specification: Blocks][jls-blocks]
- [C++ Working Draft: Compound statement or block][cpp-blocks]

[pep20]: https://peps.python.org/pep-0020/
[pep8]: https://peps.python.org/pep-0008/
[python-indentation]: https://docs.python.org/3/reference/lexical_analysis.html#indentation
[python-line-joining]: https://docs.python.org/3/reference/lexical_analysis.html#implicit-line-joining
[python-compound-statements]: https://docs.python.org/3/reference/compound_stmts.html
[python-import-statement]: https://docs.python.org/3/reference/simple_stmts.html#import
[python-reserved-identifiers]: https://docs.python.org/3/reference/lexical_analysis.html#reserved-classes-of-identifiers
[python-match-statements]: https://docs.python.org/3/tutorial/controlflow.html#match-statements
[python-calculator]: https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator
[python-docstring]: https://docs.python.org/3/glossary.html#term-docstring
[pep257]: https://peps.python.org/pep-0257/
[python-future]: https://docs.python.org/3/reference/simple_stmts.html#future
[python-future-module]: https://docs.python.org/3/library/__future__.html
[pep236]: https://peps.python.org/pep-0236/
[pep238]: https://peps.python.org/pep-0238/
[python-coding-style]: https://docs.python.org/3/tutorial/controlflow.html#intermezzo-coding-style
[python-private-variables]: https://docs.python.org/3/tutorial/classes.html#private-variables
[python-indentation-faq]: https://docs.python.org/3/faq/design.html#why-does-python-use-indentation-for-grouping-of-statements
[jls-blocks]: https://docs.oracle.com/javase/specs/jls/se26/html/jls-14.html#jls-14.2
[cpp-blocks]: https://eel.is/c++draft/stmt.block
