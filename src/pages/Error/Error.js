import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

function Error() {
  return (
    <div
      className="error"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary">
            <Link to="/">Back Home</Link>
          </Button>
        }
      />
    </div>
  );
}

export default Error;
