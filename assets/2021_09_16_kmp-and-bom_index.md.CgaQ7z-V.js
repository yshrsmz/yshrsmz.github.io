import{_ as n,c as e,L as t,o as s}from"./chunks/framework.B28L1Bbi.js";const g=JSON.parse('{"title":"Kotlin Multiplatform Project で BOM(Bill of Materials)を使う","description":"","frontmatter":{"layout":"post","title":"Kotlin Multiplatform Project で BOM(Bill of Materials)を使う","category":"programming","tags":["kotlin","kmp","gradle","TIL"],"head":[["link",{"rel":"canonical","href":"https://www.codingfeline.com/2021/09/16/kmp-and-bom/"}],["meta",{"property":"og:url","content":"https://www.codingfeline.com/2021/09/16/kmp-and-bom/"}],["meta",{"property":"og:title","content":"Kotlin Multiplatform Project で BOM(Bill of Materials)を使う"}],["meta",{"property":"twitter:card","content":"summary_large_image"}],["meta",{"property":"twitter:site","content":"@_yshrsmz"}],["meta",{"property":"twitter:creator","content":"@_yshrsmz"}],["meta",{"property":"og:image","content":"https://www.codingfeline.com/2021/09/16/kmp-and-bom/ogp.png"}]]},"headers":[],"relativePath":"2021/09/16/kmp-and-bom/index.md","filePath":"posts/2021/2021-09-16-kmp-and-bom.md","date":{"time":"2021-09-16","string":"September 16, 2021","year":"2021","month":"09","day":"16"}}'),r={name:"2021/09/16/kmp-and-bom/index.md"};function l(i,a,p,o,u,c){return s(),e("div",null,a[0]||(a[0]=[t(`<p>maven の BOM を使おうと思って Kotlin Multiplatform Project で下記のように書いてもうまく動かず、よくわからないエラーが出る。</p><div class="language-groovy vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">groovy</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">apply </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">plugin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;org.jetbrains.kotlin.multiplatform&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kotlin {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    jvm()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ios()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    sourceSets {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        commonMain {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            dependencies {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                implementation platform(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.5.2-native-mt&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                implementation </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;org.jetbrains.kotlinx:kotlinx-coroutines-core&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>↓よくわからんエラーの例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Build file &#39;/Users/yshrsmz/repos/github.com/yshrsmz/kmp-app/presentation/presentation-all/build.gradle&#39; line: 15</span></span>
<span class="line"><span></span></span>
<span class="line"><span>A problem occurred evaluating project &#39;:presentation:presentation-all&#39;.</span></span>
<span class="line"><span>&gt; No signature of method: build_8v08c9lnr0ks9pvco19p6537e.kotlin() is applicable for argument types: (build_8v08c9lnr0ks9pvco19p6537e$_run_closure1) values: [build_8v08c9lnr0ks9pvco19p6537e$_run_closure1@12d384f4]</span></span>
<span class="line"><span>  Possible solutions: notify(), toString(), toString(), toString(), toString(), split(groovy.lang.Closure)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>* Try:</span></span>
<span class="line"><span>Run with --info or --debug option to get more log output. Run with --scan to get full insights.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>* Exception is:</span></span>
<span class="line"><span>org.gradle.api.GradleScriptException: A problem occurred evaluating project &#39;:presentation:presentation-all&#39;.</span></span>
<span class="line"><span>	at org.gradle.groovy.scripts.internal.DefaultScriptRunnerFactory$ScriptRunnerImpl.run(DefaultScriptRunnerFactory.java:93)</span></span>
<span class="line"><span>	at org.gradle.configuration.DefaultScriptPluginFactory$ScriptPluginImpl.lambda$apply$0(DefaultScriptPluginFactory.java:133)</span></span>
<span class="line"><span>	at org.gradle.configuration.ProjectScriptTarget.addConfiguration(ProjectScriptTarget.java:77)</span></span>
<span class="line"><span>	at org.gradle.configuration.DefaultScriptPluginFactory$ScriptPluginImpl.apply(DefaultScriptPluginFactory.java:136)</span></span>
<span class="line"><span>	at org.gradle.configuration.BuildOperationScriptPlugin$1.run(BuildOperationScriptPlugin.java:65)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:29)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:26)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:75)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:68)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:153)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:68)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.run(DefaultBuildOperationRunner.java:56)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationExecutor.lambda$run$1(DefaultBuildOperationExecutor.java:74)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.UnmanagedBuildOperationWrapper.runWithUnmanagedSupport(UnmanagedBuildOperationWrapper.java:45)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:74)</span></span>
<span class="line"><span>	at org.gradle.configuration.BuildOperationScriptPlugin.lambda$apply$0(BuildOperationScriptPlugin.java:62)</span></span>
<span class="line"><span>	at org.gradle.configuration.internal.DefaultUserCodeApplicationContext.apply(DefaultUserCodeApplicationContext.java:44)</span></span>
<span class="line"><span>	at org.gradle.configuration.BuildOperationScriptPlugin.apply(BuildOperationScriptPlugin.java:62)</span></span>
<span class="line"><span>	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.lambda$applyToMutableState$0(DefaultProjectStateRegistry.java:280)</span></span>
<span class="line"><span>	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.fromMutableState(DefaultProjectStateRegistry.java:307)</span></span>
<span class="line"><span>	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.applyToMutableState(DefaultProjectStateRegistry.java:279)</span></span>
<span class="line"><span>	at org.gradle.configuration.project.BuildScriptProcessor.execute(BuildScriptProcessor.java:42)</span></span>
<span class="line"><span>	at org.gradle.configuration.project.BuildScriptProcessor.execute(BuildScriptProcessor.java:26)</span></span>
<span class="line"><span>	at org.gradle.configuration.project.ConfigureActionsProjectEvaluator.evaluate(ConfigureActionsProjectEvaluator.java:35)</span></span>
<span class="line"><span>	at org.gradle.configuration.project.LifecycleProjectEvaluator$EvaluateProject.lambda$run$0(LifecycleProjectEvaluator.java:100)</span></span>
<span class="line"><span>	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.lambda$applyToMutableState$0(DefaultProjectStateRegistry.java:280)</span></span>
<span class="line"><span>	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.lambda$withProjectLock$3(DefaultProjectStateRegistry.java:340)</span></span>
<span class="line"><span>	at org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:213)</span></span>
<span class="line"><span>	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.withProjectLock(DefaultProjectStateRegistry.java:340)</span></span>
<span class="line"><span>	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.fromMutableState(DefaultProjectStateRegistry.java:321)</span></span>
<span class="line"><span>	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.applyToMutableState(DefaultProjectStateRegistry.java:279)</span></span>
<span class="line"><span>	at org.gradle.configuration.project.LifecycleProjectEvaluator$EvaluateProject.run(LifecycleProjectEvaluator.java:91)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:29)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:26)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:75)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:68)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:153)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:68)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.run(DefaultBuildOperationRunner.java:56)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationExecutor.lambda$run$1(DefaultBuildOperationExecutor.java:74)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.UnmanagedBuildOperationWrapper.runWithUnmanagedSupport(UnmanagedBuildOperationWrapper.java:45)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:74)</span></span>
<span class="line"><span>	at org.gradle.configuration.project.LifecycleProjectEvaluator.evaluate(LifecycleProjectEvaluator.java:63)</span></span>
<span class="line"><span>	at org.gradle.api.internal.project.DefaultProject.evaluate(DefaultProject.java:741)</span></span>
<span class="line"><span>	at org.gradle.api.internal.project.DefaultProject.evaluate(DefaultProject.java:149)</span></span>
<span class="line"><span>	at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.ensureConfigured(DefaultProjectStateRegistry.java:253)</span></span>
<span class="line"><span>	at org.gradle.execution.TaskPathProjectEvaluator.configure(TaskPathProjectEvaluator.java:41)</span></span>
<span class="line"><span>	at org.gradle.execution.TaskPathProjectEvaluator.configureHierarchy(TaskPathProjectEvaluator.java:57)</span></span>
<span class="line"><span>	at org.gradle.configuration.DefaultProjectsPreparer.prepareProjects(DefaultProjectsPreparer.java:50)</span></span>
<span class="line"><span>	at org.gradle.configuration.BuildTreePreparingProjectsPreparer.prepareProjects(BuildTreePreparingProjectsPreparer.java:64)</span></span>
<span class="line"><span>	at org.gradle.configuration.BuildOperationFiringProjectsPreparer$ConfigureBuild.run(BuildOperationFiringProjectsPreparer.java:52)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:29)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:26)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:75)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:68)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:153)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:68)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.run(DefaultBuildOperationRunner.java:56)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationExecutor.lambda$run$1(DefaultBuildOperationExecutor.java:74)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.UnmanagedBuildOperationWrapper.runWithUnmanagedSupport(UnmanagedBuildOperationWrapper.java:45)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:74)</span></span>
<span class="line"><span>	at org.gradle.configuration.BuildOperationFiringProjectsPreparer.prepareProjects(BuildOperationFiringProjectsPreparer.java:40)</span></span>
<span class="line"><span>	at org.gradle.initialization.VintageBuildModelController.prepareProjects(VintageBuildModelController.java:85)</span></span>
<span class="line"><span>	at org.gradle.initialization.VintageBuildModelController.doBuildStages(VintageBuildModelController.java:69)</span></span>
<span class="line"><span>	at org.gradle.initialization.VintageBuildModelController.scheduleRequestedTasks(VintageBuildModelController.java:61)</span></span>
<span class="line"><span>	at org.gradle.internal.build.DefaultBuildLifecycleController.lambda$scheduleRequestedTasks$1(DefaultBuildLifecycleController.java:112)</span></span>
<span class="line"><span>	at org.gradle.internal.build.DefaultBuildLifecycleController.withModel(DefaultBuildLifecycleController.java:134)</span></span>
<span class="line"><span>	at org.gradle.internal.build.DefaultBuildLifecycleController.scheduleRequestedTasks(DefaultBuildLifecycleController.java:110)</span></span>
<span class="line"><span>	at org.gradle.internal.buildtree.DefaultBuildTreeLifecycleController.lambda$fromBuildModel$2(DefaultBuildTreeLifecycleController.java:72)</span></span>
<span class="line"><span>	at org.gradle.internal.buildtree.DefaultBuildTreeLifecycleController.lambda$doBuild$4(DefaultBuildTreeLifecycleController.java:105)</span></span>
<span class="line"><span>	at org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:213)</span></span>
<span class="line"><span>	at org.gradle.internal.buildtree.DefaultBuildTreeLifecycleController.doBuild(DefaultBuildTreeLifecycleController.java:99)</span></span>
<span class="line"><span>	at org.gradle.internal.buildtree.DefaultBuildTreeLifecycleController.fromBuildModel(DefaultBuildTreeLifecycleController.java:70)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.runner.AbstractClientProvidedBuildActionRunner.runClientAction(AbstractClientProvidedBuildActionRunner.java:58)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.runner.ClientProvidedPhasedActionRunner.run(ClientProvidedPhasedActionRunner.java:52)</span></span>
<span class="line"><span>	at org.gradle.launcher.exec.ChainingBuildActionRunner.run(ChainingBuildActionRunner.java:35)</span></span>
<span class="line"><span>	at org.gradle.internal.buildtree.ProblemReportingBuildActionRunner.run(ProblemReportingBuildActionRunner.java:50)</span></span>
<span class="line"><span>	at org.gradle.launcher.exec.BuildOutcomeReportingBuildActionRunner.run(BuildOutcomeReportingBuildActionRunner.java:69)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.FileSystemWatchingBuildActionRunner.run(FileSystemWatchingBuildActionRunner.java:90)</span></span>
<span class="line"><span>	at org.gradle.launcher.exec.BuildCompletionNotifyingBuildActionRunner.run(BuildCompletionNotifyingBuildActionRunner.java:41)</span></span>
<span class="line"><span>	at org.gradle.launcher.exec.RootBuildLifecycleBuildActionExecutor.lambda$execute$0(RootBuildLifecycleBuildActionExecutor.java:40)</span></span>
<span class="line"><span>	at org.gradle.composite.internal.DefaultRootBuildState.run(DefaultRootBuildState.java:128)</span></span>
<span class="line"><span>	at org.gradle.launcher.exec.RootBuildLifecycleBuildActionExecutor.execute(RootBuildLifecycleBuildActionExecutor.java:40)</span></span>
<span class="line"><span>	at org.gradle.internal.buildtree.DefaultBuildTreeContext.execute(DefaultBuildTreeContext.java:40)</span></span>
<span class="line"><span>	at org.gradle.launcher.exec.BuildTreeLifecycleBuildActionExecutor.lambda$execute$0(BuildTreeLifecycleBuildActionExecutor.java:40)</span></span>
<span class="line"><span>	at org.gradle.internal.buildtree.BuildTreeState.run(BuildTreeState.java:53)</span></span>
<span class="line"><span>	at org.gradle.launcher.exec.BuildTreeLifecycleBuildActionExecutor.execute(BuildTreeLifecycleBuildActionExecutor.java:40)</span></span>
<span class="line"><span>	at org.gradle.launcher.exec.RunAsBuildOperationBuildActionExecutor$3.call(RunAsBuildOperationBuildActionExecutor.java:61)</span></span>
<span class="line"><span>	at org.gradle.launcher.exec.RunAsBuildOperationBuildActionExecutor$3.call(RunAsBuildOperationBuildActionExecutor.java:57)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:200)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:195)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:75)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner$3.execute(DefaultBuildOperationRunner.java:68)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:153)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:68)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:62)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationExecutor.lambda$call$2(DefaultBuildOperationExecutor.java:79)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.UnmanagedBuildOperationWrapper.callWithUnmanagedSupport(UnmanagedBuildOperationWrapper.java:54)</span></span>
<span class="line"><span>	at org.gradle.internal.operations.DefaultBuildOperationExecutor.call(DefaultBuildOperationExecutor.java:79)</span></span>
<span class="line"><span>	at org.gradle.launcher.exec.RunAsBuildOperationBuildActionExecutor.execute(RunAsBuildOperationBuildActionExecutor.java:57)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.ContinuousBuildActionExecutor.execute(ContinuousBuildActionExecutor.java:103)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.SubscribableBuildActionExecutor.execute(SubscribableBuildActionExecutor.java:64)</span></span>
<span class="line"><span>	at org.gradle.internal.session.DefaultBuildSessionContext.execute(DefaultBuildSessionContext.java:46)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.BuildSessionLifecycleBuildActionExecuter.lambda$execute$0(BuildSessionLifecycleBuildActionExecuter.java:55)</span></span>
<span class="line"><span>	at org.gradle.internal.session.BuildSessionState.run(BuildSessionState.java:69)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.BuildSessionLifecycleBuildActionExecuter.execute(BuildSessionLifecycleBuildActionExecuter.java:54)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.BuildSessionLifecycleBuildActionExecuter.execute(BuildSessionLifecycleBuildActionExecuter.java:36)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.GradleThreadBuildActionExecuter.execute(GradleThreadBuildActionExecuter.java:36)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.GradleThreadBuildActionExecuter.execute(GradleThreadBuildActionExecuter.java:25)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.StartParamsValidatingActionExecuter.execute(StartParamsValidatingActionExecuter.java:63)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.StartParamsValidatingActionExecuter.execute(StartParamsValidatingActionExecuter.java:31)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.SessionFailureReportingActionExecuter.execute(SessionFailureReportingActionExecuter.java:58)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.SessionFailureReportingActionExecuter.execute(SessionFailureReportingActionExecuter.java:42)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.SetupLoggingActionExecuter.execute(SetupLoggingActionExecuter.java:47)</span></span>
<span class="line"><span>	at org.gradle.tooling.internal.provider.SetupLoggingActionExecuter.execute(SetupLoggingActionExecuter.java:31)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.ExecuteBuild.doBuild(ExecuteBuild.java:65)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.BuildCommandOnly.execute(BuildCommandOnly.java:37)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.WatchForDisconnection.execute(WatchForDisconnection.java:39)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.ResetDeprecationLogger.execute(ResetDeprecationLogger.java:29)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.RequestStopIfSingleUsedDaemon.execute(RequestStopIfSingleUsedDaemon.java:35)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.ForwardClientInput$2.create(ForwardClientInput.java:78)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.ForwardClientInput$2.create(ForwardClientInput.java:75)</span></span>
<span class="line"><span>	at org.gradle.util.internal.Swapper.swap(Swapper.java:38)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.ForwardClientInput.execute(ForwardClientInput.java:75)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.LogAndCheckHealth.execute(LogAndCheckHealth.java:55)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.LogToClient.doBuild(LogToClient.java:63)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.BuildCommandOnly.execute(BuildCommandOnly.java:37)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.EstablishBuildEnvironment.doBuild(EstablishBuildEnvironment.java:84)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.BuildCommandOnly.execute(BuildCommandOnly.java:37)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.api.DaemonCommandExecution.proceed(DaemonCommandExecution.java:104)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.exec.StartBuildOrRespondWithBusy$1.run(StartBuildOrRespondWithBusy.java:52)</span></span>
<span class="line"><span>	at org.gradle.launcher.daemon.server.DaemonStateCoordinator$1.run(DaemonStateCoordinator.java:297)</span></span>
<span class="line"><span>	at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:64)</span></span>
<span class="line"><span>	at org.gradle.internal.concurrent.ManagedExecutorImpl$1.run(ManagedExecutorImpl.java:48)</span></span>
<span class="line"><span>	at org.gradle.internal.concurrent.ThreadFactoryImpl$ManagedThreadRunnable.run(ThreadFactoryImpl.java:56)</span></span>
<span class="line"><span>Caused by: groovy.lang.MissingMethodException: No signature of method: build_8v08c9lnr0ks9pvco19p6537e.kotlin() is applicable for argument types: (build_8v08c9lnr0ks9pvco19p6537e$_run_closure1) values: [build_8v08c9lnr0ks9pvco19p6537e$_run_closure1@12d384f4]</span></span>
<span class="line"><span>Possible solutions: notify(), toString(), toString(), toString(), toString(), split(groovy.lang.Closure)</span></span>
<span class="line"><span>	at build_8v08c9lnr0ks9pvco19p6537e.run(/Users/yshrsmz/repos/github.com/yshrsmz/kmp-app/presentation/presentation-all/build.gradle:15)</span></span>
<span class="line"><span>	at org.gradle.groovy.scripts.internal.DefaultScriptRunnerFactory$ScriptRunnerImpl.run(DefaultScriptRunnerFactory.java:91)</span></span>
<span class="line"><span>	... 141 more</span></span></code></pre></div><p>エラーメッセージから何もわからなくて途方に暮れそうになるんだけど、<code>MissingMethodException</code> ということで「存在しないメソッド」を呼んでいるらしい。<br> ただ、サジェストされるメソッドが的はずれすぎて一体なにを間違えてるのかわからない。</p><p>そこからいろいろリバートしたりしながら切り分けていくと <code>platform()</code> があやしい。 どうやら Kotlin Multiplatform Plugin は <code>platform()</code> をサポートしていないようだ。</p><p>Kotlin のフォーラムや YouTrack を見たところ、</p><div class="language-groovy vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">groovy</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">implementation project</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dependencies</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">platform(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.5.2-native-mt&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>的に書いて Gradle 本体のメソッドを使えばよいらしく、そう書けばたしかにうまく動いてそう。</p><p><a href="https://youtrack.jetbrains.com/issue/KT-40489" target="_blank" rel="noreferrer">YouTrack の issue</a>を見る限りだと、 JetBrains 的には <code>platform()</code> や <code>enforcedPlatform()</code> を実装する予定は今のところなさそうな雰囲気。</p><hr><p>Gradleのエラーメッセージまじわからんわ、という話でした。</p><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li><a href="https://discuss.kotlinlang.org/t/kotlin-bom-in-multiplatform-projects/19694/2" target="_blank" rel="noreferrer">Kotlin-bom in multiplatform projects? - Multiplatform - Kotlin Discussions</a></li><li><a href="https://youtrack.jetbrains.com/issue/KT-40489" target="_blank" rel="noreferrer">MPP / Gradle: support BOM (enforcedPlatform) artifacts in source set dependencies DSL : KT-40489</a></li></ul>`,14)]))}const v=n(r,[["render",l]]);export{g as __pageData,v as default};