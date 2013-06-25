/*
 * Copyright (c) 2013 Jochen Hagenstroem. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*  texxt inlude  wih typos d makes  sense? tea is four  exclusive members only? */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, btoa, atob */



define(function (require, exports, module) {
    'use strict';


    // Brackets modules
    var ProjectManager = brackets.getModule("project/ProjectManager"),
        FileUtils           = brackets.getModule("file/FileUtils"),
        NativeFileSystem    = brackets.getModule("file/NativeFileSystem").NativeFileSystem;
    
    
    function _projectOpen(event){
        //window.document.title = "123";
        var $projectTitle = $("#project-title");
        var rootPath = ProjectManager.getProjectRoot().fullPath;
        _loadBranch(ProjectManager.getProjectRoot().fullPath + ".git/HEAD").done(function(loadBranchResult){
            $projectTitle.html($projectTitle.text() + " - " + loadBranchResult.branch);        
        });
    }

    /**
     * Loads a Branch from Git metadata file. 
     */
    function _loadBranch(path) {
        var result = new $.Deferred();
        var fileEntry = new NativeFileSystem.FileEntry(path);

        // HEAD contains a SHA in detached-head mode; otherwise it contains a relative path
        // to a file in /refs which in turn contains the SHA
        FileUtils.readAsText(fileEntry).done(function (text) {
            if (text.indexOf("ref: ") === 0) {
                // e.g. "ref: refs/heads/branchname"
                var branch      = text.substr(16).trim();
                
                result.resolve({ branch: branch});
            } else {
                result.reject();
            }
        }).fail(function () {
            result.reject();
        });


        return result.promise();
    }    

    
    // -----------------------------------------
    // Init
    // -----------------------------------------
    function init() {        
        var $ProjectManager = $(ProjectManager);
        $ProjectManager.on("projectOpen", _projectOpen);
    }
    
    init();
    
});