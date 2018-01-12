var textArea = $('#in1');
var hiddenPre = $('#hiddenPre');
var content = null; 
var showMargin = true;
var marginWidth = 80;

hiddenPre.addClass('hiddenPre common');

$('#in1').on('input', function(event) {
    // TODO: maybe don't allow tabs, or convert them to spaces
    $('#out1').html(reformatText($('#in1').val(), marginWidth, true, showMargin));

    updateTextAreaHeight();
});

$('#showmargin').click(function(event) {
    showMargin = this.checked;
    $('#out1').html(reformatText($('#in1').val(), marginWidth, true, showMargin));
});

$('#marginwidth').on('input', function(event) {
    if (this.value < 100) {
        $('#marginlabel').html("Margin Width: 0" + this.value);
    } else {
        $('#marginlabel').html("Margin Width: " + this.value);
    }

    marginWidth = this.value;
    $('#out1').html(reformatText($('#in1').val(), marginWidth, true, showMargin));

    $('.common').css('width', marginWidth + 'ch');
    
    updateTextAreaHeight();
});

$('#clearbutton').click(function(event) {
    $('#out1').html("");
    $('#in1').val("");
    $('#in1').css('height', 0);
});

function updateTextAreaHeight() {
    content = $('#in1').val();
    hiddenPre.html(content + '\n');
    $('#in1').css('height', hiddenPre.height());
 
    // TODO: note that this doesn't work if there is a midline tab because
    //   it may not be the width of a leading tab
    // var inputText = $('#in1').val().replace(/\t/g, 'XxXxXxXx'); // a tab is 8 chars long
    // var lines = inputText.split(/[\r\n]/);
    // var numLines = 0;
    // var i;
    // for (i = 0; i < lines.length; i++) {
    //     if (lines[i] == '') {
    //         numLines++;
    //     } else {
    //         numLines += Math.ceil(lines[i].length / marginWidth);
    //     }
    // }
    
    // $('#in1').attr('rows', numLines);
    // console.log(numLines);
}
