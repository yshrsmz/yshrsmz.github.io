---
layout: post
title: Kotlin Multiplatform Project で BOM(Bill of Materials)を使う
category: programming
tags:
  - kotlin
  - kmp
  - gradle
  - TIL
---

maven の BOM を使おうと思って Kotlin Multiplatform Project で下記のように書いてもうまく動かず、よくわからないエラーが出る。

```gradle
apply plugin: 'org.jetbrains.kotlin.multiplatform'

kotlin {
    jvm()
    ios()
    sourceSets {
        commonMain {
            dependencies {
                implementation platform("org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.5.2-native-mt")
                implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core"
            }
        }
    }
}
```

↓よくわからんエラーの例

```
Build file '/Users/yshrsmz/repos/github.com/yshrsmz/kmp-app/presentation/presentation-all/build.gradle' line: 15

A problem occurred evaluating project ':presentation:presentation-all'.
> No signature of method: build_8v08c9lnr0ks9pvco19p6537e.kotlin() is applicable for argument types: (build_8v08c9lnr0ks9pvco19p6537e$_run_closure1) values: [build_8v08c9lnr0ks9pvco19p6537e$_run_closure1@12d384f4]
  Possible solutions: notify(), toString(), toString(), toString(), toString(), split(groovy.lang.Closure)

* Try:
Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Exception is:
org.gradle.api.GradleScriptException: A problem occurred evaluating project ':presentation:presentation-all'.
	at org.gradle.groovy.scripts.internal.DefaultScriptRunnerFactory$ScriptRunnerImpl.run(DefaultScriptRunnerFactory.java:93)
	at org.gradle.configuration.DefaultScriptPluginFactory$ScriptPluginImpl.lambda$apply$0(DefaultScriptPluginFactory.java:133)
	at org.gradle.configuration.ProjectScriptTarget.addConfiguration(ProjectScriptTarget.java:77)
	at org.gradle.configuration.DefaultScriptPluginFactory$ScriptPluginImpl.apply(DefaultScriptPluginFactory.java:136)
	at org.gradle.configuration.BuildOperationScriptPlugin$1.run(BuildOperationScriptPlugin.java:65)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:29)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:26)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:75)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:68)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:153)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:68)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.run(DefaultBuildOperationRunner.java:56)
	at org.gradle.internal.operations.DefaultBuildOperationExecutor.lambda$run$1(DefaultBuildOperationExecutor.java:74)
	at org.gradle.internal.operations.UnmanagedBuildOperationWrapper.runWithUnmanagedSupport(UnmanagedBuildOperationWrapper.java:45)
	at org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:74)
	at org.gradle.configuration.BuildOperationScriptPlugin.lambda$apply$0(BuildOperationScriptPlugin.java:62)
	at org.gradle.configuration.internal.DefaultUserCodeApplicationContext.apply(DefaultUserCodeApplicationContext.java:44)
	at org.gradle.configuration.BuildOperationScriptPlugin.apply(BuildOperationScriptPlugin.java:62)
	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.lambda$applyToMutableState$0(DefaultProjectStateRegistry.java:280)
	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.fromMutableState(DefaultProjectStateRegistry.java:307)
	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.applyToMutableState(DefaultProjectStateRegistry.java:279)
	at org.gradle.configuration.project.BuildScriptProcessor.execute(BuildScriptProcessor.java:42)
	at org.gradle.configuration.project.BuildScriptProcessor.execute(BuildScriptProcessor.java:26)
	at org.gradle.configuration.project.ConfigureActionsProjectEvaluator.evaluate(ConfigureActionsProjectEvaluator.java:35)
	at org.gradle.configuration.project.LifecycleProjectEvaluator$EvaluateProject.lambda$run$0(LifecycleProjectEvaluator.java:100)
	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.lambda$applyToMutableState$0(DefaultProjectStateRegistry.java:280)
	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.lambda$withProjectLock$3(DefaultProjectStateRegistry.java:340)
	at org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:213)
	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.withProjectLock(DefaultProjectStateRegistry.java:340)
	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.fromMutableState(DefaultProjectStateRegistry.java:321)
	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.applyToMutableState(DefaultProjectStateRegistry.java:279)
	at org.gradle.configuration.project.LifecycleProjectEvaluator$EvaluateProject.run(LifecycleProjectEvaluator.java:91)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:29)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:26)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:75)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:68)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:153)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:68)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.run(DefaultBuildOperationRunner.java:56)
	at org.gradle.internal.operations.DefaultBuildOperationExecutor.lambda$run$1(DefaultBuildOperationExecutor.java:74)
	at org.gradle.internal.operations.UnmanagedBuildOperationWrapper.runWithUnmanagedSupport(UnmanagedBuildOperationWrapper.java:45)
	at org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:74)
	at org.gradle.configuration.project.LifecycleProjectEvaluator.evaluate(LifecycleProjectEvaluator.java:63)
	at org.gradle.api.internal.project.DefaultProject.evaluate(DefaultProject.java:741)
	at org.gradle.api.internal.project.DefaultProject.evaluate(DefaultProject.java:149)
	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.ensureConfigured(DefaultProjectStateRegistry.java:253)
	at org.gradle.execution.TaskPathProjectEvaluator.configure(TaskPathProjectEvaluator.java:41)
	at org.gradle.execution.TaskPathProjectEvaluator.configureHierarchy(TaskPathProjectEvaluator.java:57)
	at org.gradle.configuration.DefaultProjectsPreparer.prepareProjects(DefaultProjectsPreparer.java:50)
	at org.gradle.configuration.BuildTreePreparingProjectsPreparer.prepareProjects(BuildTreePreparingProjectsPreparer.java:64)
	at org.gradle.configuration.BuildOperationFiringProjectsPreparer$ConfigureBuild.run(BuildOperationFiringProjectsPreparer.java:52)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:29)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:26)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:75)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:68)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:153)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:68)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.run(DefaultBuildOperationRunner.java:56)
	at org.gradle.internal.operations.DefaultBuildOperationExecutor.lambda$run$1(DefaultBuildOperationExecutor.java:74)
	at org.gradle.internal.operations.UnmanagedBuildOperationWrapper.runWithUnmanagedSupport(UnmanagedBuildOperationWrapper.java:45)
	at org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:74)
	at org.gradle.configuration.BuildOperationFiringProjectsPreparer.prepareProjects(BuildOperationFiringProjectsPreparer.java:40)
	at org.gradle.initialization.VintageBuildModelController.prepareProjects(VintageBuildModelController.java:85)
	at org.gradle.initialization.VintageBuildModelController.doBuildStages(VintageBuildModelController.java:69)
	at org.gradle.initialization.VintageBuildModelController.scheduleRequestedTasks(VintageBuildModelController.java:61)
	at org.gradle.internal.build.DefaultBuildLifecycleController.lambda$scheduleRequestedTasks$1(DefaultBuildLifecycleController.java:112)
	at org.gradle.internal.build.DefaultBuildLifecycleController.withModel(DefaultBuildLifecycleController.java:134)
	at org.gradle.internal.build.DefaultBuildLifecycleController.scheduleRequestedTasks(DefaultBuildLifecycleController.java:110)
	at org.gradle.internal.buildtree.DefaultBuildTreeLifecycleController.lambda$fromBuildModel$2(DefaultBuildTreeLifecycleController.java:72)
	at org.gradle.internal.buildtree.DefaultBuildTreeLifecycleController.lambda$doBuild$4(DefaultBuildTreeLifecycleController.java:105)
	at org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:213)
	at org.gradle.internal.buildtree.DefaultBuildTreeLifecycleController.doBuild(DefaultBuildTreeLifecycleController.java:99)
	at org.gradle.internal.buildtree.DefaultBuildTreeLifecycleController.fromBuildModel(DefaultBuildTreeLifecycleController.java:70)
	at org.gradle.tooling.internal.provider.runner.AbstractClientProvidedBuildActionRunner.runClientAction(AbstractClientProvidedBuildActionRunner.java:58)
	at org.gradle.tooling.internal.provider.runner.ClientProvidedPhasedActionRunner.run(ClientProvidedPhasedActionRunner.java:52)
	at org.gradle.launcher.exec.ChainingBuildActionRunner.run(ChainingBuildActionRunner.java:35)
	at org.gradle.internal.buildtree.ProblemReportingBuildActionRunner.run(ProblemReportingBuildActionRunner.java:50)
	at org.gradle.launcher.exec.BuildOutcomeReportingBuildActionRunner.run(BuildOutcomeReportingBuildActionRunner.java:69)
	at org.gradle.tooling.internal.provider.FileSystemWatchingBuildActionRunner.run(FileSystemWatchingBuildActionRunner.java:90)
	at org.gradle.launcher.exec.BuildCompletionNotifyingBuildActionRunner.run(BuildCompletionNotifyingBuildActionRunner.java:41)
	at org.gradle.launcher.exec.RootBuildLifecycleBuildActionExecutor.lambda$execute$0(RootBuildLifecycleBuildActionExecutor.java:40)
	at org.gradle.composite.internal.DefaultRootBuildState.run(DefaultRootBuildState.java:128)
	at org.gradle.launcher.exec.RootBuildLifecycleBuildActionExecutor.execute(RootBuildLifecycleBuildActionExecutor.java:40)
	at org.gradle.internal.buildtree.DefaultBuildTreeContext.execute(DefaultBuildTreeContext.java:40)
	at org.gradle.launcher.exec.BuildTreeLifecycleBuildActionExecutor.lambda$execute$0(BuildTreeLifecycleBuildActionExecutor.java:40)
	at org.gradle.internal.buildtree.BuildTreeState.run(BuildTreeState.java:53)
	at org.gradle.launcher.exec.BuildTreeLifecycleBuildActionExecutor.execute(BuildTreeLifecycleBuildActionExecutor.java:40)
	at org.gradle.launcher.exec.RunAsBuildOperationBuildActionExecutor$3.call(RunAsBuildOperationBuildActionExecutor.java:61)
	at org.gradle.launcher.exec.RunAsBuildOperationBuildActionExecutor$3.call(RunAsBuildOperationBuildActionExecutor.java:57)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:200)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:195)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:75)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:68)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:153)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:68)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:62)
	at org.gradle.internal.operations.DefaultBuildOperationExecutor.lambda$call$2(DefaultBuildOperationExecutor.java:79)
	at org.gradle.internal.operations.UnmanagedBuildOperationWrapper.callWithUnmanagedSupport(UnmanagedBuildOperationWrapper.java:54)
	at org.gradle.internal.operations.DefaultBuildOperationExecutor.call(DefaultBuildOperationExecutor.java:79)
	at org.gradle.launcher.exec.RunAsBuildOperationBuildActionExecutor.execute(RunAsBuildOperationBuildActionExecutor.java:57)
	at org.gradle.tooling.internal.provider.ContinuousBuildActionExecutor.execute(ContinuousBuildActionExecutor.java:103)
	at org.gradle.tooling.internal.provider.SubscribableBuildActionExecutor.execute(SubscribableBuildActionExecutor.java:64)
	at org.gradle.internal.session.DefaultBuildSessionContext.execute(DefaultBuildSessionContext.java:46)
	at org.gradle.tooling.internal.provider.BuildSessionLifecycleBuildActionExecuter.lambda$execute$0(BuildSessionLifecycleBuildActionExecuter.java:55)
	at org.gradle.internal.session.BuildSessionState.run(BuildSessionState.java:69)
	at org.gradle.tooling.internal.provider.BuildSessionLifecycleBuildActionExecuter.execute(BuildSessionLifecycleBuildActionExecuter.java:54)
	at org.gradle.tooling.internal.provider.BuildSessionLifecycleBuildActionExecuter.execute(BuildSessionLifecycleBuildActionExecuter.java:36)
	at org.gradle.tooling.internal.provider.GradleThreadBuildActionExecuter.execute(GradleThreadBuildActionExecuter.java:36)
	at org.gradle.tooling.internal.provider.GradleThreadBuildActionExecuter.execute(GradleThreadBuildActionExecuter.java:25)
	at org.gradle.tooling.internal.provider.StartParamsValidatingActionExecuter.execute(StartParamsValidatingActionExecuter.java:63)
	at org.gradle.tooling.internal.provider.StartParamsValidatingActionExecuter.execute(StartParamsValidatingActionExecuter.java:31)
	at org.gradle.tooling.internal.provider.SessionFailureReportingActionExecuter.execute(SessionFailureReportingActionExecuter.java:58)
	at org.gradle.tooling.internal.provider.SessionFailureReportingActionExecuter.execute(SessionFailureReportingActionExecuter.java:42)
	at org.gradle.tooling.internal.provider.SetupLoggingActionExecuter.execute(SetupLoggingActionExecuter.java:47)
	at org.gradle.tooling.internal.provider.SetupLoggingActionExecuter.execute(SetupLoggingActionExecuter.java:31)
	at org.gradle.launcher.daemon.server.exec.ExecuteBuild.doBuild(ExecuteBuild.java:65)
	at org.gradle.launcher.daemon.server.exec.BuildCommandOnly.execute(BuildCommandOnly.java:37)
	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)
	at org.gradle.launcher.daemon.server.exec.WatchForDisconnection.execute(WatchForDisconnection.java:39)
	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)
	at org.gradle.launcher.daemon.server.exec.ResetDeprecationLogger.execute(ResetDeprecationLogger.java:29)
	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)
	at org.gradle.launcher.daemon.server.exec.RequestStopIfSingleUsedDaemon.execute(RequestStopIfSingleUsedDaemon.java:35)
	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)
	at org.gradle.launcher.daemon.server.exec.ForwardClientInput$2.create(ForwardClientInput.java:78)
	at org.gradle.launcher.daemon.server.exec.ForwardClientInput$2.create(ForwardClientInput.java:75)
	at org.gradle.util.internal.Swapper.swap(Swapper.java:38)
	at org.gradle.launcher.daemon.server.exec.ForwardClientInput.execute(ForwardClientInput.java:75)
	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)
	at org.gradle.launcher.daemon.server.exec.LogAndCheckHealth.execute(LogAndCheckHealth.java:55)
	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)
	at org.gradle.launcher.daemon.server.exec.LogToClient.doBuild(LogToClient.java:63)
	at org.gradle.launcher.daemon.server.exec.BuildCommandOnly.execute(BuildCommandOnly.java:37)
	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)
	at org.gradle.launcher.daemon.server.exec.EstablishBuildEnvironment.doBuild(EstablishBuildEnvironment.java:84)
	at org.gradle.launcher.daemon.server.exec.BuildCommandOnly.execute(BuildCommandOnly.java:37)
	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)
	at org.gradle.launcher.daemon.server.exec.StartBuildOrRespondWithBusy$1.run(StartBuildOrRespondWithBusy.java:52)
	at org.gradle.launcher.daemon.server.DaemonStateCoordinator$1.run(DaemonStateCoordinator.java:297)
	at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:64)
	at org.gradle.internal.concurrent.ManagedExecutorImpl$1.run(ManagedExecutorImpl.java:48)
	at org.gradle.internal.concurrent.ThreadFactoryImpl$ManagedThreadRunnable.run(ThreadFactoryImpl.java:56)
Caused by: groovy.lang.MissingMethodException: No signature of method: build_8v08c9lnr0ks9pvco19p6537e.kotlin() is applicable for argument types: (build_8v08c9lnr0ks9pvco19p6537e$_run_closure1) values: [build_8v08c9lnr0ks9pvco19p6537e$_run_closure1@12d384f4]
Possible solutions: notify(), toString(), toString(), toString(), toString(), split(groovy.lang.Closure)
	at build_8v08c9lnr0ks9pvco19p6537e.run(/Users/yshrsmz/repos/github.com/yshrsmz/kmp-app/presentation/presentation-all/build.gradle:15)
	at org.gradle.groovy.scripts.internal.DefaultScriptRunnerFactory$ScriptRunnerImpl.run(DefaultScriptRunnerFactory.java:91)
	... 141 more
```

エラーメッセージから何もわからなくて途方に暮れそうになるんだけど、`MissingMethodException` ということで「存在しないメソッド」を呼んでいるらしい。  
ただ、サジェストされるメソッドが的はずれすぎて一体なにを間違えてるのかわからない。

そこからいろいろリバートしたりしながら切り分けていくと `platform()` があやしい。
どうやら Kotlin Multiplatform Plugin は `platform()` をサポートしていないようだ。

Kotlin のフォーラムや YouTrack を見たところ、

```gradle
implementation project.dependencies.platform("org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.5.2-native-mt")
```

的に書いて Gradle 本体のメソッドを使えばよいらしく、そう書けばたしかにうまく動いてそう。

[YouTrack の issue](https://youtrack.jetbrains.com/issue/KT-40489)を見る限りだと、 JetBrains 的には `platform()` や `enforcedPlatform()` を実装する予定は今のところなさそうな雰囲気。


---
Gradleのエラーメッセージまじわからんわ、という話でした。


## 参考
- [Kotlin-bom in multiplatform projects? - Multiplatform - Kotlin Discussions](https://discuss.kotlinlang.org/t/kotlin-bom-in-multiplatform-projects/19694/2)
- [MPP / Gradle: support BOM (enforcedPlatform) artifacts in source set dependencies DSL : KT-40489](https://youtrack.jetbrains.com/issue/KT-40489)

