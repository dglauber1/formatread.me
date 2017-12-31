var commentSymbol = '###';
var re = /\n{2,}/; // TODO: maybe also split on tabs (tab indicates new paragraph)

// reformatText()
//
// Will accept four variables:
// textInput: the text the user has inputted
// marginWidth: an integer value representing how wide the ideal margin is
// allowOverflow: true if the reformatted text may overflow 80 characters, false otherwise
// showMargin: true if the margin (represented by '|' characters) should be 
//      shown in the output text, false otherwise
//
// Returns textInput reformatted with ideal line breaks (minimum penalty)
function reformatText(textInput, marginWidth, allowOverflow, showMargin) {
    comments = textInput.trim().split(commentSymbol);
    var outputText = "";
    var i;
    for (i = 0; i < comments.length; i++) {
        if (i % 2 == 1) {
            outputText += comments[i] + "\n";
            continue;
        }

        paragraphs = comments[i].trim().split(re);
        var reformattedParagraphs = paragraphs.map(reformatParagraph, {marginWidth: marginWidth, 
            allowOverflow: allowOverflow, showMargin: showMargin});
        outputText += reformattedParagraphs.join("\n\n") + "\n"; // adds an extra two newlines between paras
    }

    outputText = outputText.slice(0, outputText.length - 1); // remove final newline

    if (showMargin) {
        outputText = addMargin(outputText, marginWidth);
        outputText = outputText.slice(0, outputText.length - 1); // remove final newline
    }

    return outputText;
}

// reformatParagraph()
//
// Will accept one variable:
// paragraph: the paragraph to reformat
//
// Its "this" value will have the following properties:
//      marginWidth: an integer value representing how wide the ideal margin is
//      allowOverflow: true if the reformatted text may overflow 80 characters, false otherwise
//
// Returns the paragraph reformatted with ideal line breaks (minimum penalty)
function reformatParagraph(paragraph) {
    var words = paragraph.match(/\S+/g); // g for global (match all words)
    var wordLengths = words.map(function(word) {
        return word.length;
    });

    // TODO: if this.allowOverflow is false, just do the greedy algorithm, 
    //      putting as many words as possible on the current line until
    //      you hit the margin, then going on to the next line
    if (this.allowOverflow) {
        var distanceMatrix = computeDistances(wordLengths);
        var optimalLineBreaks = computeOptimalLineBreaks(distanceMatrix, this.marginWidth);
        var formattedParagraph = constructParagraph(words, optimalLineBreaks, this.marginWidth);

        return formattedParagraph;
    } else {
        return greedyReformat(words, this.marginWidth);
    }
}

// greedyReformat()
//
// Returns the given words array as a string such that no line goes beyond marginWidth
// characters in length. Greedily puts as many words on a line as possible without 
// exceeding the marginWidth in length, then goes on to the next line.
function greedyReformat(words, marginWidth) {
    if (words.length == 1) {
        return words[0];
    }

    var outputParagraph = words[0];
    var currentLineLength = outputParagraph.length;
    var i;
    for (i = 1; i < words.length; i++) {
        if (currentLineLength + words[i].length + 1 <= marginWidth) {
            outputParagraph += " " + words[i];
            currentLineLength += words[i].length + 1;
        } else {
            outputParagraph += "\n" + words[i];
            currentLineLength = words[i].length;
        }
    }

    return outputParagraph;
}

// computeDistances()
//
// Will accept one variable:
// wordLengths: the length of each word in the input paragraph
//
// Returns a 2D array where entry (i, j) stores the distance from the start of word i
//      to the end of word j
function computeDistances(wordLengths) {
    var numWords = wordLengths.length;
    var distanceMatrix = new Array(numWords);
    var i;
    for (i = 0; i < numWords; i++) {
        distanceMatrix[i] = new Array(numWords);
        distanceMatrix[i][i] = wordLengths[i];
    }
    
    var start, end;
    for (start = 0; start < numWords - 1; start++) {
        for (end = start + 1; end < numWords; end ++) {
            distanceMatrix[start][end] = distanceMatrix[start][end - 1] + 1 + wordLengths[end];
        }
    }

    return distanceMatrix;
}

// computeOptimalLineBreaks()
//
// Will accept two variables:
// distanceMatrix: a 2D table that stores the distance from any word to all of
//      its successors
// marginWidth: the width of the ideal paragraph margin
// 
// Returns an array where entry i stores the index of the word that starts
// the following line after word i, determined by minimizing the total penalty 
// of the sub-paragraph that starts with word i and ends at the end of the input
// paragraph
function computeOptimalLineBreaks(distanceMatrix, marginWidth) {
    var numWords = distanceMatrix.length;
    var optimalPenalties = new Array(numWords);
    var optimalLineBreaks = new Array(numWords);

    var i = numWords - 1;
    while (i >= 0 && marginWidth >= distanceMatrix[i][numWords - 1]) {
        optimalPenalties[i] = 0;
        optimalLineBreaks[i] = -1;
        i--;
    }

    var start; // the index of the first word in line
    for (start = i; start >= 0; start--) {
        var minPenaltyAndLinebreak = computeMinPenaltyAndLinebreak(distanceMatrix, 
            marginWidth, start, optimalPenalties);
        optimalPenalties[start] = minPenaltyAndLinebreak[0];
        optimalLineBreaks[start] = minPenaltyAndLinebreak[1];
    }

    return optimalLineBreaks;
}

// computeMinPenaltyAndLinebreak()
//
// Will accept four variables:
// distanceMatrix: a 2D table that stores the distance from any word to all of
//      its successors
// marginWidth: the width of the ideal paragraph margin
// start: the index of the word that is starting the sub-paragraph
// optimalPenalties: the partially filled array of computed minimum penalties for
//      starting a sub-paragraph at each word
//
// Returns the minimum total penalty for any combination of line breaks for a 
// sub-paragraph that starts at word start and ends at the end of the input
// paragraph. Also returns the index of the word that starts the second line
// of that optimal penalty sub-paragraph
function computeMinPenaltyAndLinebreak(distanceMatrix, marginWidth, start, optimalPenalties) {
    var minPenalty = Infinity;
    var nextLineIndex = -1; // the index of the word that starts the next line
    var end;
    for (end = start + 1; end < optimalPenalties.length; end++) {
        var linePenalty = Math.pow(marginWidth - distanceMatrix[start][end - 1], 2);
        var totalPenalty = linePenalty + optimalPenalties[end];
        if (totalPenalty < minPenalty) {
            minPenalty = totalPenalty;
            nextLineIndex = end;
        }
    }

    return [minPenalty, nextLineIndex];
}

// constructParagraph()
//
// Will accept four variables:
// words: an array of the words of the input paragraph
// optimalLineBreaks: an array where entry i stores the index of the word that starts
//      the line that follows word i
// marginWidth: an integer value representing how wide the ideal margin is
//
// Returns the input paragraph constructed according to the provided parameters
function constructParagraph(words, optimalLineBreaks, marginWidth) {
    var formattedParagraph = "";
    var wordToAddIndex = 0;
    var nextLineIndex = optimalLineBreaks[wordToAddIndex];
    while (nextLineIndex != -1) {
        while (wordToAddIndex < nextLineIndex) {
            formattedParagraph += words[wordToAddIndex] + " ";
            wordToAddIndex++;
        }

        formattedParagraph += "\n";
        nextLineIndex = optimalLineBreaks[wordToAddIndex];
    }

    while (wordToAddIndex < words.length) {
        formattedParagraph += words[wordToAddIndex] + " ";
        wordToAddIndex++;
    }

    return formattedParagraph;
}

// addMargin()
//
// Returns a string representing the given outputText with a "|" margin
// added marginWidth characters into each line.
function addMargin(outputText, marginWidth) {
    var newOutputText = "";
    var lines = outputText.split('\n');
    outputText = lines.map(function(line) {
        if (line.length > marginWidth) {
            return line.slice(0, marginWidth) + "|" + line.slice(marginWidth) + "\n";
        } else {
            var newOutputLine = line;
            var i;
            for (i = 0; i < marginWidth - line.length; i++) {
                newOutputLine += " ";
            }

            return newOutputLine + "|\n";
        } 
    }).join("");

    return outputText;
}

module.exports = {
    reformatText: reformatText
}
