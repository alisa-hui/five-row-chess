$(function(){
	var audios=$("#audios").get(0);
	var audio=$("#audio").get(0);
	var canvas=$("#canvas").get(0);
	var canvas1=$("#canvas1").get(0);
	var canvas2=$("#canvas2").get(0);
	var ctx=canvas.getContext('2d');
	var ctx1=canvas1.getContext('2d');
	var ctx2=canvas2.getContext('2d');
	var img1=$("#img1").get(0);
	var img2=$("#img2").get(0);
	var img3=$("#img3").get(0);
	var img4=$("#img4").get(0);
	var over=$(".over");
	var alert=$(".alert");
	var overv=$(".alert .v");
	var alert=$(".alert");
	var close=$(".close");
	var newg=$(".newg");
	var renshu=$(".renshu");
	var tuichu=$(".tuichu");
	var jixu=$(".jixu");
	var huiqi=$(".huiqi");
	var person=$(".person");
	var com=$(".com");
	var sep=30;
	var sR=3;
	var bR=12;
	var kongbai={};
	var AI=true;
	var qizi={};
	var gamestatus='pause';
	var obj=[];
	var qians=true;
	//关闭玩法
	var t1;
	close.on('click',function(){
		$('.jiao').css('display','none');
        $(canvas).off('click')
		//重玩
		newg.on('click',newstart);
		//认输
		renshu.on('click',function(){
			overv.html('您已认输！');
			alert.css("display","block").addClass('active');
		})
	})
		//退出
	tuichu.on('click',function(){
		location.href='index.html';
	})
	//继续
	jixu.on('click',newstart);
	//悔棋
	huiqi.on('click',function(){
		for(var s in qizi){
			if(s==obj[0]){
				console.log(obj[0])
				delete qizi[s];
				kongbai[s]='true';
			}
		}
		huaqipan()
		for(var s in qizi){
			var a1=parseInt(s.split("_")[0]);
			var a2=parseInt(s.split("_")[1]);
			luozi(a1,a2,qizi[s]);
			console.log(obj[0],qizi)
		}
	})
	//将一个整数化为坐标
	function l(x){
		return (x+0.5)*sep +0.5;
	}
	function circle(x,y){
		ctx.save();
		ctx.translate(l(x),l(y))
		ctx.beginPath();
		ctx.arc(0,0,sR,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
	function huaqipan(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.save();
		ctx.beginPath();
		for(var i=0;i<15;i++){
		   ctx.moveTo(l(0),l(i))
		   ctx.lineTo(l(14),l(i));//////横线
		   ctx.moveTo(l(i),l(0))
		   ctx.lineTo(l(i),l(14));//////竖线
		}
		ctx.stroke()
		ctx.closePath();
		ctx.restore();
		circle(3,3)
		circle(3,11)
		circle(7,7)
		circle(11,3)
		circle(11,11)
		for(var i=0;i<15;i++){
			for(var j=0;j<15;j++){
				kongbai[p(i,j)]='true';
			}
		}
	}
	huaqipan();
	
	//人机
	function intel(){
		var max=-1;
		var pos={};
		var max1=-1;
		var pos1={};
		for(var k in kongbai){
			if(kongbai[k]){
				var x=parseInt(k.split("_")[0]);
				var y=parseInt(k.split("_")[1]);
				if(isWin(x,y,"black")>=max){
					max=isWin(x,y,"black")
					pos={x:x,y:y}
				}
				if(isWin(x,y,"white")>=max1){
					max1=isWin(x,y,"white")
					pos1={x:x,y:y}
				}
			}
		}
		if(max>max1){
			return pos;
		}else{
			return pos1;
		}
	}
	//人机、人人模式
	$('.com').on('click',function(){
		if(gamestatus=='play'){
			return;
		}
		$('.person').removeClass('move');
		$(this).addClass('move');
		AI=true;
		t1=setInterval(render1,1000);
		$(canvas).on('click',headleClick);
	})
	$('.person').on('click',function(){
		if(gamestatus=='play'){
			return;
		}
		$('.com').removeClass('move');
		$(this).addClass('move');
		AI=false;
		t1=setInterval(render1,1000);
		$(canvas).on('click',headleClick);
	})
	//棋谱
	function qipu(){
		var j=1;
		$('.qipu').width(450).height(450);
		$('.closet').show();
		ctx.save();
		ctx.font='12px/1  微软雅黑';
		ctx.textAlign='center';
		ctx.textBaseline='middle';
		for(var i in qizi){
			if(qizi[i]=='white'){
				ctx.fillStyle='black';
			}else{
				ctx.fillStyle='white';
			}		
		var arr=i.split('_');
		ctx.fillText(j++,l(parseInt(arr[0])),l(parseInt(arr[1])));
        }
		ctx.restore();
		if($('.qipu').find('.imgs').length){
			$('.qipu').find('.imgs')
			.attr('src',canvas.toDataURL()).appendTo('.qipu');
			$('.qipu').find('.as')
			.attr("href",canvas.toDataURL()).attr("download","my.png").appendTo('.qipu');
		}else{
			$('<img class="imgs">')
			.attr('src',canvas.toDataURL()).appendTo('.qipu');
			$("<a class='as'>").attr("href",canvas.toDataURL()).attr("download","my.png").appendTo('.qipu');
		}		
	}
	//落子函数
	function luozi(x,y,color){
		ctx.save();
		ctx.translate(l(x),l(y))
		if(color=='black'){
			ctx.drawImage(img4,0,0,155,155,-12,-12,24,24);
			if(qians){
				audios.play();
			}else{
				audios.pause();
			}
		}else{
			ctx.drawImage(img3,0,0,155,155,-12,-12,24,24);
			if(qians){
				audios.play();
			}else{
				audios.pause();
			}
		}
		ctx.restore();
		qizi[p(x,y)]=color;
		obj[0]=p(x,y);
		delete kongbai[p(x,y)];
		gamestatus='play';
	}
	var flag=true;
	//下棋
	function headleClick(e){
		var x=Math.floor(e.offsetX/sep);
		var y=Math.floor(e.offsetY/sep);
		if(qizi[x+'_'+y]){
			return;
		}
		if(AI){
			luozi(x,y,'black')
            var p=intel();
            t1=0;
            t2=0;
            luozi(p.x,p.y,'white');
			if(isWin(x,y,'black')>=5){
				$(canvas).off('click');
				overv.html('恭喜！黑棋胜了');
				alert.addClass('active')
				alert.css("display","block");
			}else if(isWin(p.x,p.y,'white')>=5){
				$(canvas).off('click');
				overv.html('恭喜！白棋胜了');
				alert.addClass('active')
				alert.css("display","block");
			}
			return false;
		}
		if(flag){
			luozi(x,y,'black');
			a=0;
			b=0;
			render1();
			clearInterval(t1);
			render2();
			t2=setInterval(render2,1000);
			if(isWin(x,y,'black')>=5){
				overv.html('恭喜！黑棋胜了');
				alert.addClass('active')
				alert.css("display","block");
			}
		}else{
			luozi(x,y,'white');
			a=0;
			b=0;
			render2();
			clearInterval(t2);
			render1();
			t1=setInterval(render1,1000);
			if(isWin(x,y,'white')>=5){
				overv.html('恭喜！白棋胜了');
				alert.addClass('active')
				alert.css("display","block");
			}
		}
		flag=!flag;
	}
	//重玩函数
	function newstart(){
		huaqipan();
		flag=true;
		qizi={};
		gamestatus='pause';
	}
	//查看棋谱
	$('.manual').on('click',qipu);
	//关闭棋谱
	$('.closet').on('click',function(){
		qipu();
		$('.qipu').width(0).height(0)
		$(this).css("display","none");
		flag=true;
	    for(var s in qizi){
	    	var x=parseInt(s.split('_')[0]);
	    	var y=parseInt(s.split('_')[1]);
	    	if(flag){
				luozi(x,y,"black");
			}
			else{
				luozi(x,y,"white");
			}
			flag=!flag;
		}	
		return false;
	})
	//时钟
	var a=0;
	var b=0;
    function miaozhen(ctx){
		ctx.save();
		if(ctx=='ctx1'){
			ctx.rotate(Math.PI/180*6*b);
			b+=1;
		}else{
			ctx.rotate(Math.PI/180*6*a);
			a+=1;
		}
		ctx.beginPath();
		ctx.arc(0,0,4,0,2*Math.PI);
		ctx.moveTo(0,4);
		ctx.lineTo(0,8);
		ctx.moveTo(0,-4);
		ctx.lineTo(0,-15)
		ctx.closePath(); 
		ctx.stroke();
		ctx.restore();
	}
    function render1 (){
			ctx1.clearRect(23,24,40,38);
			ctx1.save();
			ctx1.translate(45,45);
			miaozhen(ctx1);
			ctx1.restore();
	}
	render1();
	function render2 (){
		ctx2.clearRect(23,24,40,38);
		ctx2.save();
		ctx2.translate(45,45);
		miaozhen(ctx2);
		ctx2.restore();
	}
	render2();
	var t2;
	img1.onload=function(){
	ctx1.drawImage(img2,0,0,560,560,0,0,100,100);
	ctx2.drawImage(img1,0,0,560,560,0,0,100,100);
    }
	function p(a,b){
		return a+"_"+b;
	}
//输赢
 function isWin(x,y,val){  
 	var count1=1;
		i=1; 
		while(qizi[p(x+i,y)]===val){
				i++;
				count1++;
			}	
		i=1;
		while(qizi[p(x-i,y)]===val){
				i++;
				count1++;
		}	
		var count2=1;
		i=1;
		while(qizi[p(x,y+i)]===val){
				i++;
				count2++
			}	
		i=1;
		while(qizi[p(x,y-i)]===val){
				i++;
				count2++
		}	
		var count3=1;
		i=1;
		while(qizi[p(x+i,y+i)]===val){
				i++;
				count3++
			}	
		i=1; 
		while(qizi[p(x-i,y-i)]===val){
				i++;
				count3++
		}	
		var count4=1;
		i=1; 
		while(qizi[p(x+i,y-i)]===val){
				i++;
				count4++
			}	
		i=1; 
		while(qizi[p(x-i,y+i)]===val){
				i++;
				count4++
		}	
		return Math.max(count1,count2,count3,count4)
}; 
//背景音效
$(audio).on('canplay',function(){
	audio.play();
	return false;
})
//播放暂停事件
	$('.pro').on("click",function(){
			if(audio.paused){
				audio.play();
			}else{
				audio.pause();
			}
			return false;
   })
//背景音效
	$('.shezhi').on("click",function(){
			qians=!qians;
   })

})