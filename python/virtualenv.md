# 虚拟环境

> 参考文章[python 虚拟环境](https://www.jb51.net/article/214307.htm)

## python 运行环境

python 的运行环境应该包含以下信息：

- python 解释器，用哪个解释器来执行代码
- python 库的位置，应该去哪 `import` 所需要的代码
- 可执行程序的位置，比如说安装了 `pip`,那么 `pip` 命令在哪

由于每个项目的情况可能不一样，如果不进行环境隔离而全局安装，就会导致包冲突从而出现问题，所以需要让每个项目都有一套独立的 python 环境。python 虚拟环境正是为了解决这个问题的，虚拟环境就是系统 python 环境的一个副本，常见的工具有以下几种：

- `virtualenv`: python3.3 之前需要，后续版本自带 `venv`
- `venv`
- `pipenv`

## `venv`

1. pip 安装 venv

```commandline
# Windows
Windows中venv已经以标准库的形式存在，不用再单独安装

# Linux
sudo apt install python3-venv # 系统可能已有
```

2. 在当前目录创建一个独立的 python 运行环境：myenv

```commandline
# Windows
py -3 -m venv myenv

# Linux
python3 -m venv myenv
```

3. 激活虚拟运行环境

```commandline
# Windows
myenv\Scripts\activate.bat

# Linux
source myenv/bin/activate
```

4. 退出虚拟环境

```commandline
deactivate
```
