# vscode fecs插件
fecs extension for vscode
# feature
 - 支持中英文切换（配置fecs.en, true: English, false: 中文）
 - 支持保存时自动使用fecs检查（配置fecs.auto, true: 自动检查, false: 输入命令或快捷键```cmd + shift + r```）
 
# install
### 安装 [fecs](http://fecs.baidu.com/)
```
sudo npm install fecs -g
```
### 安装插件 [fecs extension for vscode](https://marketplace.visualstudio.com/items?itemName=Marx.fecs&showReviewDialog=true)
在vscode里按 ```cmd + shift + p```，输入：
```
ext install fecs
```

# configuration

按```cmd + ,```打开用户配置，若使用默认配置则不用修改

```
{
    // 配置是否使用英文显示，{boolean}
    // 默认false，使用中文。设置为true，则使用英文
    "fecs.en": false,

    // 配置是否在保存文件时自动使用fecs，{boolean}
    // 本着不扰民的思想，默认false，不自动使用。设置为true，则在保存时自动使用fecs
    "fecs.auto": true
}
```
# use 
### 1. 命令操作
在打开的javascript、HTML、CSS等fecs支持的文件下

按 ```cmd + shift + p```

输入
```
fecs
```
### 2. 快捷键
```cmd + shift + r```

之后就能看见fecs输出的结果，用output输出比较方便多条信息查看，下面是演示


![img](imges/fecs1.gif)