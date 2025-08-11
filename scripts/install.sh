#!/bin/bash

# 检查参数数量
if [ "$#" -lt 1 ]; then
  echo "用法: $0 <目标目录> [版本号]"
  exit 1
fi

# 获取参数
TARGET_DIR=$1
VERSION=${2:-$(npm view @modern-openxml/cli version)}
VERSION_DIR="${TARGET_DIR}/${VERSION}"

# 获取当前 npm 源
NPM_REGISTRY=$(npm config get registry)
echo "当前 npm 源：$NPM_REGISTRY"

# 构建 tarball 的 URL
TARBALL_URL="${NPM_REGISTRY}/@modern-openxml/cli/-/cli-${VERSION}.tgz"

# 构建临时下载路径
TMP_FILE="/tmp/cli-${VERSION}.tgz"

# 下载 tarball 文件
echo "下载 ${TARBALL_URL} ..."
curl -L "$TARBALL_URL" -o "$TMP_FILE"

# 检查下载是否成功
if [ $? -ne 0 ]; then
  echo "下载失败，请检查版本号或网络连接。"
  exit 1
fi

# 创建目标目录（如果不存在）
mkdir -p "$VERSION_DIR"

# 解压 tarball 到目标目录
echo "解压到 ${VERSION_DIR} ..."
tar -xzvf "$TMP_FILE" -C "$VERSION_DIR" --strip-components=1

# 检查解压是否成功
if [ $? -ne 0 ]; then
  echo "解压失败。"
  exit 1
fi

# 安装依赖
echo "安装依赖"
cd "$VERSION_DIR"
npm i

# 设置执行权限
chmod +x "$VERSION_DIR/bin/index.mjs"

# 删除临时文件
rm -f "$TMP_FILE"

echo "安装完成：${VERSION_DIR}/bin/index.mjs"
