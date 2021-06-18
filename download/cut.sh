#!/bin/bash

#要使其变为可执行的文件
#chmod 755 cut.sh
#使 shell 脚本文件可执行后，可以输入其路径名称来运行它。例如：
#"./cut.sh"

#用 for 循环直接获取当前目录下的 mp4、mp3、avi 等文件循环处理，单个文件可以去掉 for 循环
for i in `ls *.mp4`
do
  ffmpeg -ss 00:00:01 -i $i -c:v copy -c:a copy tmp/$i
done
