cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        label1: cc.Label,
        label2: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        this.label1.string = ''
        this.label2.string = ''

        //createNew - left
        let tsr1 = TaskScheduler.createNew(4,function(){
            this.label1.string += 'tsr1 finish\n'
        },this)
        tsr1.setProgressCallback((taskCount)=>{
            this.label1.string += 'tsr1:'+taskCount+'\n'
        })
        setTimeout(()=>{
            this.label1.string += '1\n'
            tsr1.taskFinish()
        },1200)
        setTimeout(()=>{
            this.label1.string += '2\n'
            tsr1.taskFinish()
        },1100)
        setTimeout(()=>{
            this.label1.string += '3\n'
            tsr1.taskFinish()
        },1000)
        setTimeout(()=>{
            this.label1.string += '4\n'
            tsr1.taskFinish()
        },1400)
        //createBlockedQuene - right
        let tsr2 = TaskScheduler.createBlockedQuene(
            [
                function(){
                setTimeout(()=>{
                    this.label2.string += '1\n'
                    tsr2.taskFinish()
                },1200)},
                function(){
                setTimeout(()=>{
                    this.label2.string += '2\n'
                    tsr2.taskFinish()
                },1100)},
                function(){
                setTimeout(()=>{
                    this.label2.string += '3\n'
                    tsr2.taskFinish()
                },1000)},
                function(){
                setTimeout(()=>{
                    this.label2.string += '4\n'
                    tsr2.taskFinish()
                },1400)}
            ],
            function(){
                this.label2.string += 'tsr2 finish\n'
            },
            this
        )
        tsr2.setProgressCallback((taskCount)=>{
            this.label2.string += 'tsr2:'+taskCount + '\n'
        })
    },

    // called every frame
    update: function (dt) {

    },
});
