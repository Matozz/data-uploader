import React, { useState, useEffect } from "react";
import cloudbase from "@cloudbase/js-sdk/app";
import "@cloudbase/js-sdk/auth";
import "@cloudbase/js-sdk/storage";
import "@cloudbase/js-sdk/database";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Typography, Button, Upload, message, Modal, Select } from "antd";
import imageCompression from "browser-image-compression";
import "./EditQuiz.css";

const app = cloudbase.init({
  env: "wxxcx-29w9p",
});

const db = app.database();

const { Title } = Typography;
const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function EditQuiz({ editting, setEditting }) {
  const [content, setContent] = useState("");
  //   const [showPreview, setShowPreview] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadTitleUrl, setUploadTitleUrl] = useState("");
  const [uploadChoicesUrl, setUploadChoicesUrl] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [uploadList, setUploadList] = useState([]);
  const [removed, setRemoved] = useState(false);
  const [correct, setCorrect] = useState(1);

  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const props = {
    fileList,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setRemoved(true);
      return {
        fileList: newFileList,
      };
    },
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      var compressedFile;
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
      } else {
        if (isLt2M) {
          if (file.size / 1024 / 1024 > 0.5) {
            message.info("Image bigger than 500KB will be compressed!");

            setFileList([...fileList, file]);
          } else {
            setFileList([...fileList, file]);
          }
        } else {
          message.error("Image must smaller than 2MB!");
        }
      }

      return isJpgOrPng, isLt2M, false;
    },
    onChange: (info) => {
      // console.log(info.fileList);
      setFileList(
        info.fileList.filter(
          (file) =>
            (file.type === "image/png" || file.type === "image/jpeg") &&
            file.size / 1024 / 1024 < 2
        )
      );
    },
    onPreview: async (file) => {
      console.log(file);
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      setPreviewVisible(true);
      setPreviewImage(file.url || file.preview);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    },
  };

  useEffect(() => {
    if (Object.keys(editting) === 0) {
      setEditting({});
    } else {
      //   console.log(editting);
      db.collection("quizzes")
        .doc(editting._id)
        .get()
        .then((res) => {
          // console.log(res.data[0].question);
          let choicesUrl = [];
          setUploadTitleUrl(subStringLink(res.data[0].question));
          res.data[0].choices.map((value) =>
            choicesUrl.push(subStringLink(value.text))
          );
          setUploadChoicesUrl(choicesUrl);
        });
    }
  }, []);

  const subStringLink = (text) => {
    let first = text.indexOf('"');
    let last = text.indexOf('"', first + 1);
    let result = text.substring(first + 1, last);
    return result;
  };

  const handleCancelPreview = () => setPreviewVisible(false);

  const handleUpload = async () => {
    setUploading(true);
    let promiseArr = [];
    let uploadChoicesList = [];
    for (let i = 0; i < fileList.length; i++) {
      var compressedFile = await imageCompression(
        fileList[i].originFileObj,
        options
      );
      console.log(compressedFile);
      // Upload
      promiseArr.push(
        new Promise((reslove, reject) => {
          let suffix = /\.\w+$/.exec(compressedFile.name)[0];
          let fileName = new Date().getTime();

          app
            .uploadFile({
              cloudPath: `images/quizzes/${editting.chapter}/${
                editting.section
              }/${editting._id}/${fileName + suffix}`,
              filePath: compressedFile,
            })
            .then((res) => {
              // console.log(res);
              const ImageUrl = `https://7778-wxxcx-29w9p-1300523937.tcb.qcloud.la/images/quizzes/${
                editting.chapter
              }/${editting.section}/${editting._id}/${fileName + suffix}`;

              uploadChoicesList.push({
                text: `<img src="${ImageUrl}" style="max-width:100%;vertical-align:middle;"/>`,
              });

              reslove();
              // insertImgFn(
              // `https://7778-wxxcx-29w9p-1300523937.tcb.qcloud.la/images/quizzes/${
              //   editting.chapter
              // }/${editting.section}/${editting._id}/${fileName + suffix}`
              // );
            })
            .catch((err) => {
              console.log(err);
            });
        })
      );
    }
    Promise.all(promiseArr).then((res) => {
      setUploading(false);
      setRemoved(false);
      setUploadList(uploadChoicesList);
      console.log(uploadChoicesList);
      message.success("Upload Success");
    });
  };

  const beforeUpload = async (file) => {
    console.log(file);
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    } else {
      var compressedFile;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (isLt2M) {
        if (file.size / 1024 / 1024 > 0.5) {
          message.info("Image bigger than 500KB will be compressed!");

          // Compress
          compressedFile = await imageCompression(file, options);
        } else {
          compressedFile = file;
        }

        // Upload
        let suffix = /\.\w+$/.exec(file.name)[0];
        let fileName = new Date().getTime();
        app
          .uploadFile({
            cloudPath: `images/quizzes/${editting.chapter}/${
              editting.section
            }/${editting._id}/${fileName + suffix}`,
            filePath: compressedFile,
          })
          .then((res) => {
            const ImageUrl = `https://7778-wxxcx-29w9p-1300523937.tcb.qcloud.la/images/quizzes/${
              editting.chapter
            }/${editting.section}/${editting._id}/${fileName + suffix}`;
            setUploadTitleUrl(ImageUrl);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        message.error("Image must smaller than 2MB!");
      }
    }

    return isJpgOrPng;
  };

  const handleSelectChange = (value) => {
    console.log(`selected correct ${value}`);
    // setCorrect(value);
    let upload = uploadList;
    upload[value - 1].isCorrect = true;
    setUploadList(upload);
  };

  function saveContent() {
    let confirm = window.confirm("Confirm to save?");
    if (confirm) {
      setLoading(true);
      db.collection("quizzes")
        .doc(editting._id)
        .update({
          question: `<img src="${uploadTitleUrl}" style="max-width:100%;vertical-align:middle;"/>`,
          choices: uploadList,
          // [`choices.${correct - 1}.isCorrect`]: true,
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

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="editQuiz">
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
            Editting Questions
          </Title>
        </div>
        <div className="buttons">
          {/* <Button
            className="previewBtn"
            type="primary"
            shape="round"
            icon={showPreview ? <CaretUpFilled /> : <CaretDownFilled />}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Hide" : "Show"}
          </Button> */}
          <Button
            className="saveBtn"
            type="primary"
            shape="round"
            disabled={
              uploadTitleUrl === "" || uploadList.length === 0 || removed
            }
            // icon={<LoginOutlined />}
            onClick={saveContent}
            loading={loading}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="editor">
        <div className="title">
          <Title
            level={5}
            style={{ textAlign: "left" }}
            style={{ whiteSpace: "nowrap", width: 100 }}
          >
            Title：
          </Title>
          <Upload
            name="title"
            listType="picture-card"
            className="title-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            // onChange={this.handleChange}
          >
            {uploadTitleUrl !== "" ? (
              <img
                src={uploadTitleUrl}
                alt="avatar"
                style={{ width: "100%" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
        <div className="choices">
          <Title
            level={5}
            style={{ textAlign: "left" }}
            style={{ whiteSpace: "nowrap", width: 100 }}
          >
            Choices：
          </Title>
          {uploadChoicesUrl &&
            uploadChoicesUrl.map((imgUrl, index) => (
              <div
                key={imgUrl}
                style={{
                  display: "flex",
                  margin: "10px 0",
                  alignItems: "flex-end",
                }}
              >
                <div>{index + 1}. </div>
                <img src={imgUrl} style={{ height: "40px" }}></img>
              </div>
            ))}
          <Upload {...props} maxCount={4} listType="picture">
            <Button icon={<UploadOutlined />}>Select File (Max: 4)</Button>
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancelPreview}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? "Uploading" : "Start Upload"}
          </Button>
          <Select
            disabled={uploadList.length === 0}
            defaultValue="1"
            style={{ width: 80, marginLeft: 20 }}
            onChange={handleSelectChange}
          >
            {uploadList.map((value, index) => (
              <Option key={index} value={index + 1}>
                {index + 1}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

export default EditQuiz;
