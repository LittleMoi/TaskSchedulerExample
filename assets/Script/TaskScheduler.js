'use strict';
/**
 * @author littleMoi
 * @email emwings@outlook.com
 */
window.TaskScheduler = {
    /**
     * 任务调度器 构造器
     * @param taskCount 任务总权重
     * @param finishCallback 任务完成回调函数
     */
    createNew: function createNew(taskCount, finishCallback,target) {
        var tsr = {};
        /**
         * 获取当前已完成的任务总权重
         */
        tsr.getFinishCount = function () {
            return tsr._taskCount;
        };
        /**
         * 设置进度回调函数，每次调用taskFinsih都会调用一次
         * @param {*} f 
         *                  o completedCount 当前完成的任务权重
         * @param {*} target 
         */
        tsr.setProgressCallback = function (f, target) {
            if (target) {
                tsr.progressCallF = f.bind(target);
            } else {
                tsr.progressCallF = f;
            }
        };
        /**
         * 通知调度器已完成当前任务
         * @param gravity 当前任务的权重，缺省值为1
         */
        tsr.taskFinish = function (gravity) {
            if (gravity != null) {
                if (gravity > 0) {
                    tsr._taskCount += gravity;
                }
            } else {
                tsr._taskCount++;
            }
            if (tsr.progressCallF) {
                tsr.progressCallF(tsr._taskCount);
            }
            if (tsr._taskFinishCount <= tsr._taskCount) {
                if (tsr._finishCallback) {
                    tsr._finishCallback();
                } else {
                    cc.warn('task finish!But callback is null！');
                }
            }
        };
        tsr._taskCount = 0;
        tsr._taskFinishCount = taskCount;
        tsr._finishCallback = finishCallback.bind(target);
        return tsr;
    },
    /**
     * 阻塞队列 构造器
     * @param functions 任务数组
     * @param finishCallback 任务完成回调函数
     * @param target 前二参数的目标对象，一般为this。如果前二参数目标对象不一样，请置空
     */
    createBlockedQuene: function createBlockedQuene(functions, finishCallback, target) {
        var cbq = {};
        cbq.functions = [];
        for (var i = 0 ; i < functions.length ; i++) {
            var func = functions[i]
            if (func instanceof Function) {
                if (target) {
                    cbq.functions.push(func.bind(target));
                } else {
                    cbq.functions.push(func);
                }
            }
        }
        var cn = this.createNew(cbq.functions.length, finishCallback.bind(target));
        cbq.getFinishCount = cn.getFinishCount;
        cbq.setProgressCallback = cn.setProgressCallback;
        cbq.taskFinish = function (gravity) {
            cn.taskFinish(gravity);
            if (cbq.index < cbq.functions.length) {
                cbq.functions[cbq.index++]();
            }
        };
        cbq.index=0;
        cbq.functions[cbq.index++]();
        return cbq;
    }
};