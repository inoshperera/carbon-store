/*
 *  Copyright (c) 2005-2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
$(function () {
    validator.initValidationEvents('form-asset-create',function(){});
    $('#btn-create-asset').removeAttr('disabled');
    var obtainFormMeta = function (formId) {
        return $(formId).data();
    };
    var populateTags = function (arr) {
        var entry;
        for (var index = 0; index < arr.length; index++) {
            entry = arr [index];
            if (entry.name === '_tags') {
                entry.value = tagsAPI.selectedTags();
            }
        }
    };
    $('#form-asset-create').ajaxForm({
        beforeSubmit: function (arr) {
            var createButton = $('#btn-create-asset');
            createButton.attr('disabled', 'disabled');
            createButton.next().attr('disabled', 'disabled');
            caramel.render('loading', 'Creating asset. Please wait..', function (info, content) {
                var $content = $(content).removeClass('loading-animation-big').addClass('loading-animation');
                createButton.parent().append($content);
            });
            populateTags(arr);
            if (!validator.isValidForm('form-asset-create')) {
                window.scrollTo(0, 0);
                $('div.error').each(function () {
                    var $container = $(this).closest('div.responsive-form-container');
                    if (!$container.hasClass('in')) {
                        $container.show('fast').addClass('in');
                    }
                });
                $('#btn-create-asset').removeAttr('disabled');
                setTimeout(
                    function () {
                        $('.loading-animation').remove();
                    }, 1000);
                return false;
            }
        },
        success: function (data) {
            var options = obtainFormMeta('#form-asset-create');
            $('#btn-create-asset').removeAttr('disabled');
            $.cookie("new-asset-" + data.type, data.id + ":" + data.type + ":" + data.name);
            window.location = options.redirectUrl;
        },
        error: function () {
            messages.alertError('Unable to add the ' + PublisherUtils.resolveCurrentPageAssetType() + ' instance.');
            $('#btn-create-asset').removeAttr('disabled');
            $('.fa-spinner').parent().remove();
        }
    });
    var initDatePicker = function () {
        if ($(this).attr('data-render-options') == "date-time") {
            var dateField = this;
            $(this).DatePicker({
                mode: 'single',
                position: 'right',
                onBeforeShow: function (el) {
                    if ($(dateField).val().replace(/^\s+|\s+$/g, "")) {
                        $(dateField).DatePickerSetDate($(dateField).val(), true);
                    }

                },
                onChange: function (date, el) {
                    $(el).val((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
                    if ($('#closeOnSelect input').attr('checked')) {
                        $(el).DatePickerHide();
                    }
                }
            });
        }
    };

    $('#form-asset-create input[type="text"]').each(initDatePicker);


    var removeUnboundRow = function(link){
        var table = link.closest('table');
        var requiredOneRow = false;
        var numberOfRows = $('tr',table).length;
        if(table.attr('data-required-row')){
            requiredOneRow = true;
        }
        if(requiredOneRow && numberOfRows == 2){
            messages.alertError('Required to have at-least one row.');
            return false;
        }
        if(numberOfRows == 2){
            table.hide();
        }
        link.closest('tr').remove();
    };

    $('.js-add-unbounded-row').click(function () {
        var tableName = $(this).attr('data-name');
        var table = $('#table_' + tableName);
        table.find('thead').show();
        var referenceRow = $('#table_reference_' + tableName);
        var newRow = referenceRow.clone().removeAttr('id');
        $('input[type="text"]', newRow).val('');
        table.show().append(newRow);
        table.find('thead').show();
        $('input[type="text"]', newRow).each(initDatePicker);

    });
    $('.js-unbounded-table').on('click', 'a', function (event) {
        removeUnboundRow($(event.target));
    });

    $('.js-unbounded-table').on('click', 'input[type="checkbox"]', function (event) {
        var checkbox = event.target;
        var hiddenField = $(checkbox).next();
        if ($(checkbox).is(":checked")) {
            $(hiddenField).val('on');
        } else {
            $(hiddenField).val('off');
        }
    });

    $('.tmp_refernceTableForUnbounded').each(function () {
        $(this).detach().attr('class', 'refernceTableForUnbounded').appendTo('body');
    });

    $('.tmp_refernceTableForOptionText').each(function () {
        $(this).detach().attr('class', 'refernceTableForUnbounded').appendTo('body');
    });

    $('#form-asset-create a.collapsing-h2').off('click', '**').on('click', function (e) {
        e.preventDefault();
        var $panel = $(this).parent().next();
        if($panel.is(":visible")){
            $panel.hide('fast');
        }else{
            $panel.show('fast');
        }
    });
    $('#form-asset-create .responsive-form-container').each(function(){
        if($(this).attr('id') != 'collapseoverview'){
            $(this).hide();
        }
    });


});