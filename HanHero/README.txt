
开发者可将项目中的部分场景、资源、代码等内容划分到不同的 Asset Bundle 中，这些 Asset Bundle 不会在游戏启动时加载，而是由开发者在游戏过程中手动调用 loadBundle 进行加载，从而有效降低游戏启动的时间，尽可能做到按需加载。
Asset Bundle 可以按需求随意放置，比如可以放在远程服务器、本地、或者小游戏平台的分包中。也可以跨项目复用，用于加载子项目中的 Asset Bundle。

从 v2.4 开始，项目中所有的资源都会分类放在 Creator 内置的 4 个 Asset Bundle 中：
1、internal（优先级11）	存放所有内置资源以及其依赖资源	通过配置 资源管理器 中的 internal -> resources 文件夹，但目前不支持修改默认配置
2、main（优先级7）	存放所有在 构建发布 面板的 参与构建场景 中勾选的场景以及其依赖资源	通过配置 构建发布 面板的 主包压缩类型 和 配置主包为远程包 两项
3、resources（优先级8）	存放 resources 目录下的所有资源以及其依赖资源	通过配置 资源管理器 中的 assets -> resources 文件夹
4、start-scene（优先级9）	如果在 构建发布 面板中勾选了 初始场景分包，则首场景将会被构建到 start-scene 中。具体内容可参考 初始场景的资源加载。	无法进行配置

Creator 开放了 10 个可供配置的优先级，编辑器在构建时将会按照优先级 从大到小 的顺序对 Asset Bundle 依次进行构建。
1、当同个资源被 不同优先级 的多个 Asset Bundle 引用时，资源会优先放在优先级高的 Asset Bundle 中，低优先级的 Asset Bundle 只会存储一条记录信息。此时低优先级的 Asset Bundle 会依赖高优先级的 Asset Bundle。
如果你想在低优先级的 Asset Bundle 中加载此共享资源，必须在加载低优先级的 Asset Bundle 之前 先加载高优先级的 Asset Bundle。
2、当同个资源被 相同优先级 的多个 Asset Bundle 引用时，资源会在每个 Asset Bundle 中都复制一份。此时不同的 Asset Bundle 之间没有依赖关系，可按任意顺序加载。所以请尽量确保共享的资源（例如 Texture、SpriteFrame、Audio 等）所在的 Asset Bundle 优先级更高，以便让更多低优先级的 Asset Bundle 共享资源，从而最小化包体。
3、建议其他自定义的 Asset Bundle 优先级（推荐使用1-6) 不要高于 内置的 Asset Bundle，以便尽可能共享内置 Asset Bundle 中的资源。

Creator 目前提供了 默认、无压缩、合并所有 JSON、小游戏分包、Zip 这几种压缩类型用于优化 Asset Bundle。所有 Asset Bundle 默认使用 默认 压缩类型，开发者可重新设置包括内置 Asset Bundle（除了 internal）在内的所有 Asset Bundle 的压缩类型。
1、默认	构建 Asset Bundle 时会将相互依赖的资源的 JSON 文件合并在一起，从而减少运行时的加载请求次数
2、无压缩	构建 Asset Bundle 时没有任何压缩操作
3、合并所有 JSON	构建 Asset Bundle 时会将所有资源的 JSON 文件合并为一个，从而最大化减少请求数量，但可能会增加单个资源的加载时间
4、小游戏分包	在提供了分包功能的小游戏平台，会将 Asset Bundle 设置为对应平台上的分包。
5、Zip	在部分小游戏平台，构建 Asset Bundle 时会将资源文件压缩成一个 Zip 文件，从而减少运行时的加载请求数量

在构建时，配置为 Asset Bundle 的文件夹中的所有 代码 和 资源，会进行以下处理：
1、代码：文件夹中的所有代码会根据发布平台合并成一个 index.js 或 game.js 的入口脚本文件，并从主包中剔除。
2、资源：文件夹中的所有资源以及文件夹外的相关依赖资源都会放到 import 或 native 目录下。
3、资源配置：所有资源的配置信息包括路径、类型、版本信息都会被合并成一个 config.json 文件。

注意：
有些平台不允许加载远程的脚本文件，例如微信小游戏，在这些平台上，Creator 会将 Asset Bundle 的代码拷贝到 src/scripts 目录下，从而保证正常加载。
不同 Asset Bundle 中的脚本建议最好不要互相引用，否则可能会导致在运行时找不到对应脚本。

=================================
推荐：
1、项目所有脚本放到src/scripts 中， Asset Bundle 仅仅包含某模块中资源（图集动画等）、界面（场景）
2、resources 目录用于存放共享资源（图标、按钮、字体）、初始场景。但是脚本放在resources之外，而且非Asset Bundle文件夹。
3、大厅（主城）、地图寻路、后宫、战斗模块采用单独 Asset Bundle 来管理加载及释放资源。
4、项目代码采用pureMVC 模式，数据、通信、界面分开处理。可以将puremvc.js直接放入assest目录，设置成插件，或者以模块require形式都可以。

=================================

官方说法：
resources 文件夹里面的资源，可以关联依赖到文件夹外部的其它资源，同样也可以被外部场景或资源引用到。项目构建时，除了已在 构建发布 面板勾选的场景外，resources 文件夹里面的所有资源，连同它们关联依赖的 resources 文件夹外部的资源，都会被导出。
如果一份资源不需要由脚本直接动态加载，那么千万不要放在 resources 文件夹里。







