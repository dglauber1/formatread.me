var textArea = $('#in1');
var hiddenPre = $('#hiddenPre');
var content = null; 
var showMargin = true;
var marginWidth = 80;

hiddenPre.addClass('hiddenPre common');

$('#in1').on('input', function(event) {
    if ($('#in1').val() == '') {
        $('#out1').html("");
    } else {
        $('#out1').html(reformatText($('#in1').val(), marginWidth, true, showMargin));
    }

    content = $(this).val();
    hiddenPre.html(content);
    $(this).css('height', hiddenPre.height());
});

$('#showmargin').click(function(event) {
    showMargin = this.checked;
    if ($('#in1').val() == '') {
        $('#out1').html("");
    } else {
        $('#out1').html(reformatText($('#in1').val(), marginWidth, true, showMargin));
    }
});

$('#marginwidth').on('input', function(event) {
    $('#marginlabel').html("Margin Width: " + this.value);
    // TODO: make margin label constant width ("50" is less width than "120")

    marginWidth = this.value;
    if ($('#in1').val() == '') {
        $('#out1').html("");
    } else {
        $('#out1').html(reformatText($('#in1').val(), marginWidth, true, showMargin));
    }

    $('.common').css('width', marginWidth + 'ch');
    
    content = $('#in1').val();
    hiddenPre.html(content);
    $('#in1').css('height', hiddenPre.height());
});

$('#clearbutton').click(function(event) {
    $('#out1').html("");
    $('#in1').val("");
    $('#in1').css('height', 0);
});
