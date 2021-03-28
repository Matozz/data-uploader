import React, { useState, useEffect } from "react";
import cloudbase from "@cloudbase/js-sdk/app";
import "@cloudbase/js-sdk/auth";
import "@cloudbase/js-sdk/storage";
import "@cloudbase/js-sdk/database";
import "./Questions.css";
import { Typography, Table, Tooltip } from "antd";
import EditQuiz from "../EditQuiz/EditQuiz";

const app = cloudbase.init({
  env: "wxxcx-29w9p",
});

const db = app.database();

const { Title } = Typography;

function Questions() {
  const [data, setDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
  });
  const [editting, setEditting] = useState({});

  const edit = (record) => {
    console.log(record);
    let confirm = window.confirm("Start Editing?");
    if (confirm) {
      setEditting(record);
    }
  };

  const columns = [
    {
      title: "_id",
      dataIndex: "_id",
      width: "20%",
      ellipsis: {
        showTitle: false,
      },
      render: (_id) => (
        <Tooltip placement="topLeft" title={_id}>
          {_id}
        </Tooltip>
      ),
    },
    {
      title: "Chapter",
      dataIndex: "chapter",
      sorter: {
        compare: (a, b) => a.chapter - b.chapter,
        multiple: 1,
      },
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: {
        compare: (a, b) => a.section - b.section,
        multiple: 2,
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: {
        compare: (a, b) => a.type - b.type,
        multiple: 3,
      },
      render: (type) => {
        if (type === "0")
          return (
            <Tooltip placement="topLeft" title={"0"}>
              {"单选"}
            </Tooltip>
          );
        if (type === "1")
          return (
            <Tooltip placement="topLeft" title={"1"}>
              {"多选"}
            </Tooltip>
          );
        if (type === "2")
          return (
            <Tooltip placement="topLeft" title={"2"}>
              {"判断"}
            </Tooltip>
          );
        if (type === "3")
          return (
            <Tooltip placement="topLeft" title={"Deprecated"}>
              {"填空 🗑"}
            </Tooltip>
          );
      },
    },
    {
      title: "Solution_id",
      dataIndex: "solution_id",
    },
    {
      title: "Question",
      dataIndex: "question",
      ellipsis: {
        showTitle: false,
      },
      render: (question) => (
        <Tooltip placement="topLeft" title={question} visible={false}>
          {String(question)}
        </Tooltip>
      ),
    },
    {
      title: "Choices",
      dataIndex: "choices",
      ellipsis: {
        showTitle: false,
      },
      render: (choices) =>
        console.log(choices),
        // <Tooltip placement="topLeft" visible={false}>
        //   {String(choices)}
        // </Tooltip>
    },
    {
      title: "Edit",
      dataIndex: "edit",
      render: (_, record) => {
        return (
          <Typography.Link onClick={() => edit(record)}>Edit</Typography.Link>
        );
      },
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    // Database
  };

  useEffect(() => {
    db.collection("quizzes")
      .get()
      .then((res) => {
        setDate(res.data);
        console.log(res.data);
      });
  }, []);

  return (
    <>
      <div className="questions" hidden={Object.keys(editting).length !== 0}>
        <Title level={2} style={{ textAlign: "left" }}>
          Questions
        </Title>
        <Table
          size="middle"
          bordered
          columns={columns}
          rowKey={(record) => record._id}
          dataSource={data}
          pagination={{ ...pagination, size: "default", showSizeChanger: true }}
          loading={loading}
          onChange={handleTableChange}
        />
      </div>
      {Object.keys(editting).length !== 0 ? (
        <EditQuiz editting={editting} setEditting={setEditting} />
      ) : null}
    </>
  );
}

export default Questions;
