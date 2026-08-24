# Python 设计意图树教程

这套教程从 Python 的运行方式和设计取舍进入语言本身。它不从语法表开始，而是先建立几个能贯穿后续学习的基本判断：Python 为什么适合交互实验和小脚本，为什么运行结果主要进入对象模型，名字如何指向对象，命名空间如何隔离名字，模块如何让一个文件既能运行又能复用。

第一阶段聚焦 Python 语言和工程基础。AI 应用、RAG、智能客服和框架细节放在后续阶段；那些内容会回到同一组基础机制上理解，而不是另起一套零散术语。

## 目录

1. [Python 为什么把代码运行成对象、名字和模块？](01-running-model-code-blocks-namespaces.md)

## 后续主题

- 数据表达：`list`、`dict`、`tuple`、`set` 如何承载结构化数据。
- 行为组织：函数、参数、返回值和作用域如何形成可复用行为。
- 模块边界：模块、包和导入规则如何组织多文件程序。
- 可读性约束：命名、结构、PEP 20 和 PEP 8 如何影响长期维护。
- 错误和资源边界：异常、`try`、`with` 如何表达失败与清理。
- 对象模型：类、实例、属性和方法如何扩展运行时对象世界。
- 环境与依赖：`venv`、`pip`、`pyproject.toml` 如何支撑项目运行。
- 类型提示：类型标注如何作为工程契约服务测试、编辑器和边界数据。

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
