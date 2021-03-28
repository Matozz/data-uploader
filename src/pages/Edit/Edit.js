import React, { useState, useEffect } from "react";
import E from "wangeditor";
import cloudbase from "@cloudbase/js-sdk/app";
import "@cloudbase/js-sdk/auth";
import "@cloudbase/js-sdk/storage";
import "@cloudbase/js-sdk/database";
import { Typography, Button } from "antd";
import {
  CaretDownFilled,
  CaretUpFilled,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import imageCompression from "browser-image-compression";
import "./Edit.css";

let editor = null;

const app = cloudbase.init({
  env: "wxxcx-29w9p",
});

const db = app.database();

const { Title } = Typography;

function Edit({ editting, setEditting }) {
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [loading, setLoading] = useState(false);

  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  useEffect(() => {
    editor = new E("#editor");

    editor.config.onchange = (newHtml) => {
      setContent(newHtml);
    };

    editor.config.height = 500;
    editor.config.placeholder = "Enter Text Here";
    editor.config.excludeMenus = [
      "link",
      // "video",
      "emoticon",
      "todo",
      "fontName",
      "code",
    ];
    // Code baddly support on miniprogram!

    editor.config.showLinkImg = false;

    editor.config.customUploadVideo = function (resultFiles, insertVideoFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
      // Upload
      let suffix = /\.\w+$/.exec(resultFiles[0].name)[0];
      let fileName = new Date().getTime();

      console.log(suffix);

      app
        .uploadFile({
          cloudPath: `videos/sections/${editting.chapter}/${editting.section}/${
            fileName + suffix
          }`,
          filePath: resultFiles[0],
        })
        .then((res) => {
          // 上传视频，返回结果，将视频插入到编辑器中
          insertVideoFn(
            `https://7778-wxxcx-29w9p-1300523937.tcb.qcloud.la/videos/sections/${
              editting.chapter
            }/${editting.section}/${fileName + suffix}`
          );
          console.log(res);
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    editor.config.customUploadImg = async function (resultFiles, insertImgFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      for (let i = 0; i < resultFiles.length; i++) {
        console.log(resultFiles);

        // Compress
        const compressedFile = await imageCompression(resultFiles[i], options);
        // console.log(
        //   `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        // );

        // Upload
        let suffix = /\.\w+$/.exec(resultFiles[i].name)[0];
        let fileName = new Date().getTime();
        app
          .uploadFile({
            cloudPath: `images/sections/${editting.chapter}/${
              editting.section
            }/${fileName + suffix}`,
            filePath: compressedFile,
          })
          .then((res) => {
            // console.log(res);
            insertImgFn(
              `https://7778-wxxcx-29w9p-1300523937.tcb.qcloud.la/images/sections/${
                editting.chapter
              }/${editting.section}/${fileName + suffix}`
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    editor.create();
    editor.disable();

    return () => {
      editor.destroy();
    };
  }, []);

  useEffect(() => {
    if (Object.keys(editting) === 0) {
      setEditting({});
    } else {
      console.log(editting);
      db.collection("sections")
        .doc(editting._id)
        .get()
        .then((res) => {
          setContent(res.data[0].content);
          editor.txt.html(res.data[0].content);
          editor.enable();
        });
    }
  }, []);

  // function getHtml() {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     alert(content);
  //   }, 1000);
  // }

  function saveContent() {
    let confirm = window.confirm("Confirm to save?");
    if (confirm) {
      setLoading(true);
      db.collection("sections")
        .doc(editting._id)
        .update({
          content: content,
        })
        .then(() => {
          setLoading(false);
          alert("Save Success");
        })
        .catch((err) => console.log(err));
    }
  }

  const back = () => {
    let confirm = window.confirm("Changes that you made may not be saved.");
    if (confirm) {
      setEditting({});
    }
  };

  return (
    <div className="edit">
      <div className="header">
        <div className="title">
          <Button
            type="text"
            icon={<ArrowLeftOutlined style={{ fontSize: 24, marginTop: 2 }} />}
            size="large"
            onClick={back}
            style={{ marginRight: 8 }}
          ></Button>
          <Title level={2} style={{ textAlign: "left" }}>
            Editting Sections
          </Title>
        </div>
        <div className="buttons">
          <Button
            className="previewBtn"
            type="primary"
            shape="round"
            icon={showPreview ? <CaretUpFilled /> : <CaretDownFilled />}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Hide" : "Show"}
          </Button>
          <Button
            className="saveBtn"
            type="primary"
            shape="round"
            // icon={<LoginOutlined />}
            onClick={saveContent}
            loading={loading}
          >
            Save
          </Button>
        </div>
      </div>

      <div id="editor" />

      <div className="previewHtml" hidden={!showPreview}>
        {content}
      </div>
    </div>
  );
}

export default Edit;
