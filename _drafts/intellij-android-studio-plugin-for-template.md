---
layout: post
title: Android Studio/IntelliJでカスタムの新規ファイル作成用テンプレートをプラグインとして提供する
category: programming
tags:
  - kotlin
  - android
  - intellij
---


Kotlin Multiplatform ProjectでAndroid/iOS向けアプリを作っている。  
アーキテクチャとか設計周りがだいたい終わって、いざコードを書き始めると画面を作るときの定型コードがそこそこあって地味にめんどくさい。

そこで[Android Studioでよくやる方法](https://qiita.com/k_keisuke/items/bc8282e7bf68eebd643e)でカスタムテンプレートを追加しようと思ったら、Androidなソースセット内でしか使えない上に生成されたコードは `src/main/java` に入ってしまうことが判明した。

まあハックみたいな方法だしもっとスマートにできる方法探すかー、ということでIntelliJのプラグインを作ってみることにした。  
Kotlinプラグインの新規ファイル作成周りを参考にしたら、結構簡単にできた。


## そもそもプラグインてどうつくるの

JetBrains公式の[このへん](https://www.jetbrains.org/intellij/sdk/docs/tutorials/build_system/prerequisites.html)を見ると一通りわかるのでまずはやってみてほしい。


## 新規ファイル作成用のアクションてどうつくるの

まずはテンプレートを用意する。  
テンプレートはVelocityで記述し、拡張子は`.ft`だ。  
`./src/resources/fileTemplates/internal` に設置する。  
今回は`SampleClass File.kt.ft`という名前にする。

```
#if (${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME}

#end

class ${NAME} {
    fun test() {
        println("this is sample template file!")
    }
}
```

同じ階層に`SampleClass File.kt.html`というフィアルを設置すると、これはそのテンプレートに対する説明用htmlになる。

作成したテンプレートは`plugin.xml`に登録する必要がある。　　
`extensions`要素の中に下記のように記述する。

```xml
<extensions defaultExtensionNs="com.intellij">
    <internalFileTemplate name="SampleClass File"/>
</extensions>
```

そして肝心のアクションクラスだが、`CreateFileFromTemplateAction` を継承すると作ることができる。

```kotlin
package com.example.intellij

import com.intellij.icons.AllIcons
import com.intellij.ide.actions.CreateFileFromTemplateAction
import com.intellij.ide.actions.CreateFileFromTemplateDialog
import com.intellij.ide.fileTemplates.FileTemplate
import com.intellij.ide.fileTemplates.FileTemplateManager
import com.intellij.ide.fileTemplates.actions.AttributesDefaults
import com.intellij.ide.fileTemplates.ui.CreateFromTemplateDialog
import com.intellij.openapi.actionSystem.DataContext
import com.intellij.openapi.actionSystem.LangDataKeys
import com.intellij.openapi.actionSystem.PlatformDataKeys
import com.intellij.openapi.application.runWriteAction
import com.intellij.openapi.project.DumbAware
import com.intellij.openapi.project.DumbService
import com.intellij.openapi.project.Project
import com.intellij.openapi.roots.ProjectRootManager
import com.intellij.openapi.ui.InputValidatorEx
import com.intellij.openapi.util.IconLoader
import com.intellij.psi.PsiDirectory
import com.intellij.psi.PsiFile
import com.intellij.util.IncorrectOperationException
import java.util.*

class NewSampleFileAction: CreateFileFromTemplateAction(
    "New Sample File",   // 右クリックメニューに表示されるテキスト
    "Create New Sample File", // 説明文。どこに表示されるかは不明
    null // 右クリックメニューで表示されるアイコン。なくてもよい
), DumbAware {

    // クラス名等入力するダイアログを作成
    override fun buildDialog(
        project: Project,
        directory: PsiDirectory,
        builder: CreateFileFromTemplateDialog.Builder
    ) {
        // 表示されるダイアログのタイトル
        builder.setTitle("New SampleClass file")
            // kindは複数設定することができ、2個以上あるとセレクトボックスが表示される。
            // 一つのときは表示されないので、タイトルからテンプレート名がわかるようにしておくといい。
            // 第一引数がセレクトボックスに表示されるテキスト。
            // 第二引数が対応するアイコン
            // 第三引数が対応するテンプレート名
            .addKind("SampleClass", AllIcons.FileTypes.Any_type, "SampleClass File")

        // 入力された文字列の検証用クラスを渡す
        builder.setValidator(NameValidator)
    }

    override fun getActionName(directory: PsiDirectory?, newName: String, templateName: String?): String =　"Sample File"

    // 右クリックした場所に応じて、アクションを表示するか決める
    override fun isAvailable(dataContext: DataContext): Boolean {
        if (super.isAvailable(dataContext)) {
            val ideView = LangDataKeys.IDE_VIEW.getData(dataContext)!!
            val project = PlatformDataKeys.PROJECT.getData(dataContext)!!
            val projectFileIndex = ProjectRootManager.getInstance(project).fileIndex
            // ソースディレクトリ内だったらアクションを表示する
            return ideView.directories.any { projectFileIndex.isInSourceContent(it.virtualFile) }
        }
        return false
    }

    override fun startInWriteAction() = false

    override fun createFileFromTemplate(
        name: String,    // 入力された名前
        template: FileTemplate, // 選択されたテンプレート
        dir: PsiDirectory  // 右クリックされたディレクトリ
    ): PsiFile? {
        // ここで `name` を頑張って加工するとパッケージ名を分解してディレクトリも一緒に作ったりできる
        // 今回はサンプルなので入力された名称でクラスを生成する。

        // インデックス中でも動作させるために、一時的にインデックスを使わないモードを有効にする？
        // うまく説明できない…
        // パフォーマンスが悪いので、必ず最後にfalseにする
        val service = DumbService.getInstance(dir.project)
        service.isAlternativeResolveEnabled = true

        try {
            val project = dir.project
            val defaultProperties = FileTemplateManager.getInstance(project).defaultProperties

            // テンプレートで使える値を増やしたいときはここに追加
            val properties = Properties(defaultProperties)

            val element = try {
                CreateFromTemplateDialog(
                    project, dir, template,
                    AttributesDefaults(name).withFixedName(true),
                    properties
                ).create()
            } catch (e: IncorrectOperationException) {
                throw e
            } catch (e: Exception) {
                LOG.error(e)
                return null
            }

            return element?.containingFile
        } finally {
            service.isAlternativeResolveEnabled = false
        }
    }

    companion object {
        private object NameValidator : InputValidatorEx {
            override fun getErrorText(inputString: String): String? {
                if (inputString.trim().isEmpty()) {
                    return "Name can't be empty"
                }

                val parts: List<String> = inputString.split(*FQNAME_SEPARATORS)
                if (parts.any { it.trim().isEmpty() }) {
                    return "Name can't have empty parts"
                }

                return null
            }

            override fun checkInput(inputString: String): Boolean {
                return true
            }

            override fun canClose(inputString: String): Boolean {
                return getErrorText(inputString) == null
            }

        }
    }
}
```

このアクションクラスも`plugin.xml`に登録する。

```xml
<actions>
    <action id="SampleClass.NewFile" class="com.example.intellij.NewSampleFileAction">
        <add-to-group group-id="NewGroup" anchor="after" relative-to-action="NewGroup1"/>
    </action>
</actions>
```

あとは `./gradlew runIde` するとデバッグ用のIDEが立ち上がってデバッグできる。  
`./gradlew buildPlugin` するとzip形式でプラグインが出力され、Android Studioとか任意のIntelliJ系IDEで利用できる。
