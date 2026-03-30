import path from 'node:path';
import fs from 'node:fs';

// 侧边栏项的类型：可以是分组（目录）或链接（文件）
type SidebarItem = SidebarGroup | SidebarLink;

interface SidebarGroup {
    text: string;
    collapsible: boolean;
    items: SidebarItem[];
}

interface SidebarLink {
    text: string;
    link: string;
}

// 文件根目录（当前工作目录）
const DIR_PATH: string = path.resolve();

// 白名单：需要过滤掉的文件/文件夹
const WHITE_LIST: string[] = [
    'index.md',
    '.vitepress',
    'node_modules',
    '.idea',
    'assets',
];

/**
 * 判断给定路径是否为目录
 */
function isDirectory(dirPath: string): boolean {
    try {
        return fs.lstatSync(dirPath).isDirectory();
    } catch (error) {
        console.error(`Failed to check path "${dirPath}":`, error);
        return false;
    }
}

/**
 * 返回 arr1 中不在 arr2 中的元素（差集）
 */
function difference<T>(arr1: T[], arr2: T[]): T[] {
    const set2 = new Set(arr2);
    return arr1.filter(item => !set2.has(item));
}

/**
 * 递归构建侧边栏数据
 * @param fileNames 当前目录下的文件/文件夹名数组
 * @param absolutePath 当前目录的绝对路径（文件系统）
 * @param relativeUrlPath 当前目录对应的 URL 路径（相对于站点根目录，以 '/' 开头）
 * @returns 侧边栏项数组
 */
function getSidebarItems(
    fileNames: string[],
    absolutePath: string,
    relativeUrlPath: string
): SidebarItem[] {
    const items: SidebarItem[] = [];

    for (const fileName of fileNames) {
        const fullPath = path.join(absolutePath, fileName);
        const isDir = isDirectory(fullPath);

        if (isDir) {
            // 目录：递归处理子项
            const subItems = getSidebarItems(
                fs.readdirSync(fullPath),
                fullPath,
                path.posix.join(relativeUrlPath, fileName) // URL 路径用 posix 拼接
            );
            items.push({
                text: fileName,
                collapsible: true,
                items: subItems,
            });
        } else {
            // 文件：只处理 .md 文件
            const ext = path.extname(fileName);
            if (ext !== '.md') continue;

            const nameWithoutExt = path.basename(fileName, '.md');
            const link = path.posix.join(relativeUrlPath, nameWithoutExt);
            // 注意：VitePress 中链接通常需要以 '/' 开头，且不需要 .md 后缀
            items.push({
                text: nameWithoutExt,
                link: link.startsWith('/') ? link : `/${link}`,
            });
        }
    }

    return items;
}

/**
 * 生成 VitePress 侧边栏配置
 * @param pathname 相对于项目根目录的路径（例如 '/docs' 或 'docs'），表示需要生成侧边栏的目录
 * @returns 侧边栏配置数组，如果目录读取失败则返回空数组
 */
export function setSidebar(pathname: string): SidebarItem[] {
    // 将传入的路径转换为绝对路径（支持以 '/' 开头或不带）
    const normalizedPathname = pathname.replace(/^\/+/, '');
    const absoluteDir = path.join(DIR_PATH, normalizedPathname);

    let files: string[];
    try {
        files = fs.readdirSync(absoluteDir);
    } catch (error) {
        console.error(`Failed to read directory "${absoluteDir}":`, error);
        return [];
    }

    // 过滤掉白名单中的文件/文件夹
    const filteredFiles = difference(files, WHITE_LIST);

    // 构建 URL 基路径：确保以 '/' 开头
    const baseUrlPath = `/${normalizedPathname}`;

    return getSidebarItems(filteredFiles, absoluteDir, baseUrlPath);
}