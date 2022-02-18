module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修补bug
        'docs', // 文档变动
        'style', // 格式变动（样式等不影响css的运行）
        'refactor', // 重构（不新增，不修改bug的变动）
        'perf', // 提高性能的代码变动
        'test', // 增加测试
        'chore', // 构建工程或辅助工具的变动
        'revert' // 恢复以前的提交（回退、回滚）
      ]
    ],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never']
  }
}
