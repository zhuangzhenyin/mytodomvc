var task_list = []; //建立人物列表
var showitem = ""; //确定显示任务类型
//列表初始化
init();

//添加todo事件
$(".add-task").on("submit",function (ev) {
	ev.preventDefault(); //对表单阻止默认事件
	obj = {};
	obj.content = $(".new-todo").val();
	if(!$(".new-todo").val()) return;
	$(".new-todo").val(""); //清空输入框
	addTask(obj);
	createHtml();
})
//加入任务数组，并保存至本地
function addTask(obj) {
	task_list.push(obj);
	store.set("event",task_list);
}

//初始化
function init() {
	task_list = store.get("event") || [];
	createHtml();
}

//创建列表元素，绑定标签;
function createHtml() {
	$(".todo-list").html(null); //每次创建整个列表时先清空列表
	switch (store.get("showitem")) {
		case "Active":
			$(".Active").addClass("selected");
			for(var i = 0;i < task_list.length;i++) {
				var $item = bindHtml(task_list[i],i);
				if(task_list[i].completed) {
					$item.addClass("completed");
					continue;
				}
				$(".todo-list").append($item);
			};
			break;
		case "Completed":
			$(".completed").addClass("selected");
			for(var i = 0;i < task_list.length;i++) {
				if(task_list[i].completed) {
					var $item = bindHtml(task_list[i],i);
					$item.addClass("completed");
					$(".todo-list").append($item);
				}
			};
			break;
		default :
			$(".all").addClass("selected");
			for(var i = 0;i < task_list.length;i++) {
				var $item = bindHtml(task_list[i],i);
				$(".todo-list").append($item);
				if(task_list[i].completed) {
					$item.addClass("completed");
				}
			};
			break;
	}
	deleteTask(); //删除
	completed(); //标记完成事件
	selectAll(); //全选
	Active(); //过滤
	showAll();//显示全部
	showCompleted(); //显示已完成事件
	deleCompleted(); //删除所有已完成事件
	leftItem();//计算剩余的事件
}

//绑定元素
function bindHtml(data,index) {
	var str = "";
	str = 
		'<li ng-class="{completed:Xtodo.completed,editing:Xtodo.id===currentEditingId}"  ng-repeat="Xtodo in todos | filter:selector"  data-id="'+index+'">'+
			'<div class="view">'+
				'<input class="toggle" type="checkbox" ng-model="Xtodo.completed" '+(data.completed? "checked" : "")+'>'+
				'<label ng-dblclick="editing(Xtodo.id)">'+data.content+'</label>'+
				'<button class="destroy" ng-click="remove(Xtodo.id)"></button>'+
			'</div>'+
			'<form ng-submit="editing()">'+
				'<input class="edit" ng-model="Xtodo.text">'+
			'</form>'+
		'</li>';
	return $(str);
}

//删除
function deleteTask() {
	$(".destroy").on("click",function () {
		var index = $(this).parent().parent().data("id");
		// $(".todo-list li").eq(index).remove();
		task_list.splice(index,1);
		store.set("event",task_list);
		createHtml();
	})
}

//标记完成事件
function completed() {
	$(".toggle").on("click",function () {
		var index = $(this).parent().parent().data("id");
		// $(this).parent().parent().addClass("completed");
		if(task_list[index].completed) {
			// task_list[index].completed = false;
			upda_data({completed:false},index);
		}
		else {
			upda_data({completed:true},index);
		}
		createHtml();
		isSelectAll();
		leftItem();
	})
}

//更新本地数据内容
function upda_data(newobj,index) {
	task_list[index] = $.extend({},task_list[index],newobj);
	store.set("event",task_list);
}

//全选
function selectAll() {
	$(".toggle-all").on("click",function () {
		for(var i = 0;i < task_list.length;i++) {
			task_list[i].completed = $(this)[0].checked;
			upda_data({completed:$(this)[0].checked},i);
		}
		createHtml();
	});
}

//显示全部
function showAll() {
	$(".all").on("click",function () {
		$(".filters li a").removeClass();
		$(this).addClass("selected");
		store.set("showitem","all");
		createHtml();
	});
}
		
//过滤已经完成的事件
function Active() {
	$(".Active").on("click",function () {
		$(".filters li a").removeClass();
		$(this).addClass("selected");
		store.set("showitem","Active");
		createHtml();
	});
}

//过滤未完成事件
function showCompleted() {
	$(".completed").on("click",function () {
		$(".filters li a").removeClass();
		$(this).addClass("selected");
		store.set("showitem","Completed");
		createHtml();
	});
}

//清空所有完成事件
function deleCompleted() {
	$(".clear-completed").on("click",function () {
		for(var i = 0;i < task_list.length;i++) {
			if(task_list[i].completed) {
				task_list.splice(i,1);
			}
		}
		store.set("event",task_list);
		createHtml();
	});
}
//判断是否全选
function isSelectAll() {
	var off = true;
	for(var i = 0;i < task_list.length;i++) {
		if(task_list[i].completed == false) {
			off = false;
		}
	}
	if(off) {
		$(".toggle-all")[0].checked = true;
	}
	else {
		$(".toggle-all")[0].checked = false;
	}
}

//判断留下的未完成item
function leftItem() {
	var num = 0;
	for(var i = 0;i < task_list.length;i++) {
		if(!task_list[i].completed) {
			num++;
		}
	}
	$(".todo-count strong").text(num);
}