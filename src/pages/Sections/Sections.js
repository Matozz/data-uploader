import React, { useState, useEffect } from "react";
import cloudbase from "@cloudbase/js-sdk/app";
import "@cloudbase/js-sdk/auth";
import "@cloudbase/js-sdk/storage";
import "@cloudbase/js-sdk/database";
import "./Sections.css";
import { Typography, Table, Tooltip } from "antd";
import Edit from "../Edit/Edit";

const app = cloudbase.init({
  env: "wxxcx-29w9p",
});

const db = app.database();

const { Title } = Typography;

function Sections() {
  const [data, setDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
  });
  const [editting, setEditting] = useState({});

  const edit = (record) => {
    // console.log(record);
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
      title: "Lights",
      dataIndex: "lights",
      sorter: {
        compare: (a, b) => a.lights - b.lights,
        multiple: 3,
      },
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Content",
      dataIndex: "content",
      ellipsis: {
        showTitle: false,
      },
      render: (content) => (
        <Tooltip placement="topLeft" title={content} visible={false}>
          {content}
        </Tooltip>
      ),
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
    db.collection("sections")
      .get()
      .then((res) => {
        setDate(res.data);
        console.log(res.data);
      });
  }, []);
  return (
    <>
      <div className="sections" hidden={Object.keys(editting).length !== 0}>
        <Title level={2} style={{ textAlign: "left" }}>
          Sections
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
        <Edit editting={editting} setEditting={setEditting} />
      ) : null}
    </>
  );
}

export default Sections;
