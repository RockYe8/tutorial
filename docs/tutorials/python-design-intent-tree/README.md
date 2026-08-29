# Python 设计意图树教程

这套教程从 Python 的运行方式和设计取舍进入语言本身。它不从语法表开始，而是先建立几个能贯穿后续学习的基本判断：Python 为什么适合交互实验和小脚本，为什么运行结果主要进入对象模型，名字如何指向对象，命名空间如何隔离名字，模块如何让一个文件既能运行又能复用。

课程专注 Python 语言本身，同时服务工程化和学术化能力：读懂中型项目、复现实验脚本、组织可维护代码、定位错误、控制依赖、表达数据和行为边界。外部框架、机器学习库、Web 框架和大模型应用不进入主线；它们以后只作为 Python 语言机制的迁移场景。

## 目录

1. [Python 为什么把代码运行成对象、名字和模块？](01-running-model-code-blocks-namespaces.md)
2. [Python 为什么用 `list`、`tuple`、`dict`、`set` 组织对象？](02-data-structures-object-organization.md)
3. [Python 为什么把行为包装成函数对象？](03-functions-behavior-objects.md)
4. [Python 为什么用模块和包组织多文件程序？](04-modules-packages-import-boundaries.md)
5. [Python 为什么把可读结构分给语法、约定和作者判断？](05-readable-code-visible-structure-conventions.md)

## 完整路线

公开章节按 24 章规划推进。每章先形成完整 `## 本章推理总览`，经审阅后再展开正文；正文完成后配套最小练习和反馈问题。

6. 类和实例：`class`、instance、attribute、method、`self`
7. 属性查找：实例属性、类属性、方法绑定和查找顺序
8. 可变状态：对象状态、别名、副作用、拷贝和共享引用
9. 继承与组合：继承、组合、替换关系和边界代价
10. Python 数据模型：特殊方法、协议、`len`、`iter`、`in` 与语法协作
11. 错误与资源边界：`exception`、`try`、`except`、`raise`、`finally`、`with`
12. 迭代模型：iterable、iterator、`for`、`range`、`enumerate`
13. 生成器：`yield`、惰性计算、流式数据和一次性迭代
14. 推导式：list/dict/set comprehension、generator expression
15. 作用域深入：`global`、`nonlocal`、closure、late binding
16. 装饰器：函数包装、语法糖、横切逻辑和边界代价
17. 类型注解：annotation、`typing`、可选值、联合类型和工具边界
18. 数据承载形式：`dataclass`、`NamedTuple`、`Enum` 和不可变意图
19. 文件与序列化：`pathlib`、`open`、文本/字节、JSON、pickle 边界
20. 标准库组合工具：`collections`、`itertools`、`functools`、`contextlib`
21. 环境与依赖：`venv`、`pip`、`pyproject.toml`、版本和可复现运行
22. 测试反馈：`assert`、测试函数、fixture 思想和可测试边界
23. 调试、日志和配置：traceback、`logging`、环境变量和配置边界
24. 综合阅读：如何阅读一个中型 Python 项目的语言结构

更详细的路线说明见 [ROADMAP.md](ROADMAP.md)。

## 资料边界

正文中的关键判断优先引用 Python 官方文档、PEP、CPython 文档和语言设计者的一手材料。跨语言比较用于说明不同语言在共同问题下的取舍，不把 Python、Java 或 C++ 简化成单一优劣判断。

## Sources

- [Python Tutorial][python-tutorial]
- [Python Data Model][python-data-model]
- [Python Execution Model][python-execution-model]
- [Python Design and History FAQ][python-design-faq]
- [PEP 20: The Zen of Python][pep20]
- [PEP 8: Style Guide for Python Code][pep8]

[python-tutorial]: https://docs.python.org/3/tutorial/
[python-data-model]: https://docs.python.org/3/reference/datamodel.html
[python-execution-model]: https://docs.python.org/3/reference/executionmodel.html
[python-design-faq]: https://docs.python.org/3/faq/design.html
[pep20]: https://peps.python.org/pep-0020/
[pep8]: https://peps.python.org/pep-0008/
