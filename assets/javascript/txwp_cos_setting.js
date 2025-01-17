/*
 * Copyright (C) 2020 Tencent Cloud.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
jQuery(function ($) {
    var ajaxUrl = $("#wpcosform_cos_info_set").data("ajax-url");

    $("#customize_secret_information_checkbox_id").change(function () {
        var disabled = !($(this).is(':checked'));
        $("#input_secret_id").attr('disabled', disabled);
        $("#input_secret_key").attr('disabled', disabled);
    });

    function change_type(input_element, span_eye) {
        if (input_element[0].type === 'password') {
            input_element[0].type = 'text';
            span_eye.addClass('dashicons-visibility').removeClass('shicons-hidden');
        } else {
            input_element[0].type = 'password';
            span_eye.addClass('shicons-hiddenda').removeClass('dashicons-visibility');
        }
    }

    $('#secret_id_change_type').click(function () {
        change_type($('#input_secret_id'), $('#secret_id_change_type'));
    });

    $('#secret_key_change_type').click(function () {
        change_type($('#input_secret_key'), $('#secret_key_change_type'));
    });

    $('#input_secret_id').blur(function () {
        if ($('#customize_secret_information_checkbox_id')[0].checked === true && !($('#input_secret_id')[0].value)) {
            $('#span_secret_id')[0].innerHTML = "SecretId的值不能为空";
            $('#span_secret_id').show();
        } else {
            $('#span_secret_id').hide();
        }
    });

    $('#input_secret_key').blur(function () {
        if ($('#customize_secret_information_checkbox_id')[0].checked === true && !($('#input_secret_key')[0].value)) {
            $('#span_secret_key')[0].innerHTML = "secretkey的值不能为空";
            $('#span_secret_key').show();
        } else {
            $('#span_secret_key').hide();
        }
    });

    $('#input_region').blur(function () {
        if (!($('#input_region')[0].value)) {
            $('#span_region')[0].innerHTML = "所属地域的值不能为空";
            $('#span_region').show();
        } else {
            $("#select_region option").each(function () {
                if ($(this)[0].value === $('#input_region')[0].value) {
                    $(this)[0].selected = true;
                } else {
                    $(this)[0].selected = false;
                }
            });
            $('#span_region').hide();
        }
    });

    $('#select_region').change(function () {
        $('#input_region')[0].value = $('#select_region option:selected').attr('value');
        $('#span_region').hide();
    });

    $('#input_bucket').blur(function () {
        var bucket_name = $('#input_bucket')[0].value;
        if (!bucket_name) {
            $('#span_bucket')[0].innerHTML = "存储桶名不能为空";
            return
        } else {
            var region_name = $('#input_region')[0].value;
            var secret_id = $('#input_secret_id')[0].value;
            var secret_key = $('#input_secret_key')[0].value;

            if ($('#customize_secret_information_checkbox_id')[0].checked === true) {
                if (!secret_id || !secret_key) {
                    $('#span_bucket')[0].innerHTML = "SecretId、SecretKey的值都不能为空！";
                    return
                }
            }

            if (!region_name) {
                $('#span_bucket')[0].innerHTML = "所属地域的值不能为空！";
                return
            }

            $.ajax({
                type: "post",
                url: ajaxUrl,
                dataType: "json",
                data: {
                    action: "check_cos_bucket",
                    region: region_name,
                    secret_id: secret_id,
                    secret_key: secret_key,
                    bucket: bucket_name
                },
                success: function (response) {
                    if (response.success) {
                        $('#span_bucket').hide();
                    } else {
                        $('#span_bucket')[0].innerHTML = "该存储桶不存在，请检查对应存储桶参数是否填写正确";
                        $('#span_bucket').show();
                    }
                }
            });
        }
    });

    $('#input_upload_url_path').blur(function () {
        if (!($('#input_upload_url_path')[0].value)) {
            $('#span_upload_url_path')[0].innerHTML = "访问域名的值不能为空";
            $('#span_upload_url_path').show();
        } else {
            $('#span_upload_url_path').hide();
        }
    });

    $('#auto_rename_style_customize_prefix').blur(function () {
        var pwdRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;  //判断字符串是否由数字,字母，下划线组成

        if (!pwdRegex.test($('#auto_rename_style_customize_prefix')[0].value)
            && $('#auto_rename_style_customize_prefix')[0].value) {

            $('#auto_rename_error_message')[0].innerHTML = "请输入由字母、数字、下划线或中文组成的字符串";
            $('#auto_rename_error_message').show();
        } else {
            $('#auto_rename_error_message').hide();
        }
    });
    $('#auto_rename_style_customize_postfix').blur(function () {
        var pwdRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;  //判断字符串是否为数字，字母，下划线组成

        if (!pwdRegex.test($('#auto_rename_style_customize_postfix')[0].value)
            && $('#auto_rename_style_customize_postfix')[0].value) {

            $('#auto_rename_error_message')[0].innerHTML = "请输入由字母、数字、下划线或中文组成的字符串";
            $('#auto_rename_error_message').show();
        } else {
            $('#auto_rename_error_message').hide();
        }
    });

    $('#button_save').click(function () {
        var region_name = $('#input_region')[0].value;
        var bucket_name = $('#input_bucket')[0].value;
        var upload_url_path = $('#input_upload_url_path')[0].value;
        var secret_id = $('#input_secret_id')[0].value;
        var secret_key = $('#input_secret_key')[0].value;
        if ($('#customize_secret_information_checkbox_id')[0].checked == true) {
            if (!secret_id || !secret_key) {
                alert("SecretId、SecretKey的值都不能为空！");
                return false
            }
        }

        if (!region_name || !bucket_name || !upload_url_path) {
            alert("SecretId、SecretKey、所属地域、空间名称和访问域名的值都不能为空！");
            return false;
        }

        if ($('#auto_rename_switch')[0].checked && $('#auto_rename_style_customize')[0].checked) {
            var filename_prefix = $('#auto_rename_style_customize_prefix')[0].value;
            var filename_postfix = $('#auto_rename_style_customize_postfix')[0].value;
            var pwdRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;  //判断字符串是否由数字,字母，下划线组成

            if (filename_prefix && !pwdRegex.test(filename_prefix)) {
                alert("自定义文件名前缀是由字母、数字、下划线或中文组成的字符串！");
                return false;
            }

            if (filename_postfix && !pwdRegex.test(filename_postfix)) {
                alert("自定义文件名后缀是由字母、数字、下划线或中文组成的字符串！");
                return false;
            }
        }

        $.ajax({
            type: "post",
            url: ajaxUrl,
            dataType: "json",
            data: {
                action: "save_cos_options",
                formdata: $('form#wpcosform_cos_info_set').serialize()
            },
            success: function (response) {
                if (response.success) {
                    $('#span_button_save')[0].innerHTML = "保存成功！";

                } else {
                    $('#span_button_save')[0].innerHTML = "保存失败！";
                }
                $('#span_button_save').show().delay(3000).fadeOut();
                setTimeout(location.reload.bind(location), 3000);
                //location.reload();
            }
        });
    });

    $('#form_cos_info_replace').click(function () {
        $.ajax({
            type: "post",
            url: ajaxUrl,
            dataType: "json",
            data: {
                action: "replace_localurl_to_cosurl"
            },
            success: function (response) {
                if (response.success) {
                    $('#span_cos_info_replace')[0].innerHTML = "成功替换" + response.data.replace + "个COS地址！";
                    $('#span_cos_info_replace').show().delay(5000).fadeOut();
                } else {
                    $('#span_cos_info_replace')[0].innerHTML = "替换失败，请检查本地文件路径和cos地址路径是否正确！";
                    $('#span_cos_info_replace').show().delay(5000).fadeOut();
                }
            }
        });
    });

    $('#form_cos_attachment_sync').click(function () {
        $.ajax({
            type: "post",
            url: ajaxUrl,
            dataType: "json",
            data: {
                action: "sync_attachment_to_cos"
            },
            success: function (response) {
                if (response.success) {
                    $('#span_attachment_sync')[0].innerHTML = "成功同步" + response.data.replace + "个附件！";
                    $('#span_attachment_sync').show().delay(5000).fadeOut();
                } else {
                    $('#span_attachment_sync')[0].innerHTML = "同步失败，请检查腾讯云cos配置信息、本地文件路径和cos地址路径是否正确，如正确则没有附件可同步，请您上传附件";
                    $('#span_attachment_sync').show().delay(5000).fadeOut();
                }
            }
        });
    });

    $('#button_delete_logfile').click(function () {
        $.ajax({
            type: "post",
            url: ajaxUrl,
            dataType: "json",
            data: {
                action: "delete_cos_logfile"
            },
            success: function (response) {
                if (response.success) {
                    $('#span_delete_logfile')[0].innerHTML = "删除成功！";
                    $('#span_delete_logfile').show().delay(5000).fadeOut();
                }
            }
        });
    });

    $('#image_process_switch').change(function () {
        if ($('#image_process_switch')[0].checked) {
            $('#div_img_process_code').show();
        } else {
            $('#div_img_process_code').hide();
        }
    });

    $('#automatic_logging_switch').change(function () {
        if ($('#automatic_logging_switch')[0].checked) {
            $('#div_delete_filelog_code').show();
        } else {
            $('#div_delete_filelog_code').hide();
        }
    });

    $('#auto_rename_switch').change(function () {
        if ($('#auto_rename_switch')[0].checked) {
            $('#div_auto_rename').show();
        } else {
            $('#div_auto_rename').hide();
        }
    });

    $('#img_process_style_default').change(function () {
        if ($('#img_process_style_default')[0].checked) {
            $('#img_process_style_customize_input')[0].disabled = true;
        }
    });

    $('#img_process_style_customize').change(function () {
        if ($('#img_process_style_customize')[0].checked) {
            $('#img_process_style_customize_input')[0].disabled = false;
        }
    });

    $('#auto_rename_style_default1').change(function () {
        if ($('#auto_rename_style_default1')[0].checked) {
            $('#auto_rename_style_customize_prefix')[0].disabled = true;
            $('#auto_rename_style_customize_prefix')[0].value = '';
            $('#auto_rename_style_customize_postfix')[0].disabled = true;
            $('#auto_rename_style_customize_postfix')[0].value = '';
        }
    });

    $('#auto_rename_style_default2').change(function () {
        if ($('#auto_rename_style_default2')[0].checked) {
            $('#auto_rename_style_customize_prefix')[0].disabled = true;
            $('#auto_rename_style_customize_prefix')[0].value = '';
            $('#auto_rename_style_customize_postfix')[0].disabled = true;
            $('#auto_rename_style_customize_postfix')[0].value = '';
        }
    });

    $('#auto_rename_style_customize').change(function () {
        if ($('#auto_rename_style_customize')[0].checked) {
            $('#auto_rename_style_customize_postfix')[0].disabled = false;
            $('#auto_rename_style_customize_prefix')[0].disabled = false;
        }
    });

    $('#cos_attachment_sync_link').click(function () {
        $('#cos_attachment_sync_desc').toggle();
    });

    $('#cos_info_replace_link').click(function () {
        $('#cos_info_replace_desc').toggle();
    });

    var updateSlimState = function (cb) {
        $('#image_slim_state').text('加载中...');
        $('#button_image_slim_switch').attr('disabled', 'disabled');
        $.ajax({
            type: "post",
            url: ajaxUrl,
            dataType: "json",
            data: {
                action: "get_image_slim",
            },
            success: function (res) {
                if (res.success && res.data && res.data.message === 'ok') {
                    var isAutoModeOpen = (res.data.slimMode || '').toUpperCase().split(',').includes('AUTO')
                    if (isAutoModeOpen) {
                        $('#image_slim_state').css('color', 'green').text('已开启极智压缩');
                        $('#button_image_slim_switch').attr('data-status', 'on').attr('disabled', null).html('关闭极智压缩');
                    } else {
                        $('#image_slim_state').css('color', 'gray').text('未开启极智压缩');
                        $('#button_image_slim_switch').attr('data-status', 'off').attr('disabled', null).html('开启极智压缩');
                    }
                } else {
                    $('#image_slim_state').css('color', 'gray').html('未开启（' + res.data.message + '）');
                }
                cb && cb();
            },
            error: function (xhr) {
                $('#image_slim_state').text(xhr.responseText);
                cb && cb();
            },
        });
    };
    updateSlimState();

    // 切换极智压缩状态
    $('#button_image_slim_switch').click(function (e) {
        var switchToStatus = $(e.target).attr('data-status') === 'on' ? 'off' : 'on';
        var actionText = switchToStatus === 'on' ? '开启' : '关闭';
        $('#image_slim_state').css('color', 'gray').text('加载中...');
        $('#button_image_slim_switch').attr('disabled', 'disabled');
        $.ajax({
            type: "post",
            url: ajaxUrl,
            dataType: "json",
            data: {
                action: "set_image_slim",
                status: switchToStatus,
            },
            success: function (res) {
                updateSlimState(function () {
                    if (res.success && res.data && res.data.message === 'ok') {
                        // $('#image_slim_msg').text(actionText + '成功').show();
                    } else {
                        $('#image_slim_msg').html(actionText + '失败（' + res.data.message + '）').show();
                    }
                    setTimeout(function () {
                        $('#image_slim_msg').hide();
                    }, 3000);
                });
            },
            error: function (xhr) {
                $('#image_slim_msg').html(xhr.responseText);
                updateSlimState();
            },
        });
    });
});
