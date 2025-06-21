/**
 * GitHub API 获取最新 Release 返回 json 类型接口
 */
export interface GitHubApiReleaseResponse {
    /**
     * 该 release 对应的 api 地址
     */
    url: string;
    /**
     * 该 release 对应的资源 api 地址，内容与后续的 assets 一致
     */
    assets_url: string;
    /**
     * 暂未和
     */
    upload_url: string;
    /**
     * GitHub Release 页面
     */
    html_url: string;
    /**
     * Release 的 Id
     */
    id: number;
    /**
     * Release 发布者
     */
    author: Author;
    node_id: string;
    /**
     * Release 标签
     */
    tag_name: string;
    /**
     * Release 提交分支
     */
    target_commitish: string;
    /**
     * Release 名称
     */
    name: string;
    draft: boolean;
    prerelease: boolean;
    created_at: Date;
    published_at: Date;
    /**
     * 该 release 对应的资源
     */
    assets: Asset[];
    tarball_url: string;
    zipball_url: string;
    /**
     * 版本发布说明（Markdown）
     */
    body: string;
}

/**
 * Release 资源
 */
export interface Asset {
    url: string;
    id: number;
    node_id: string;
    name: string;
    label: null;
    uploader: Author;
    content_type: string;
    state: string;
    size: number;
    download_count: number;
    created_at: Date;
    updated_at: Date;
    browser_download_url: string;
}

/**
 * Release 发布者
 */
export interface Author {
    /**
     * 用户名称
     */
    login: string;
    /**
     * 用户 Id
     */
    id: number;
    /**
     * 节点 Id（未知用途）
     */
    node_id: string;
    /**
     * 用户头像链接
     */
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}


export interface WorkerResult{
    type: WorkerResult
    data: any;
}