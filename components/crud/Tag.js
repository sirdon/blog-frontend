import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { isAuth, getCookie } from "../../actions/auth";
import { create, getTags, getTag, removeTag } from "../../actions/tag";
const Tag = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    tags: [],
    removed: false,
    reload: false,
  });
  const { name, error, success, tags, removed, reload } = values;
  const token = getCookie("token");
  useEffect(() => {
    loadTag();
  }, [reload]);
  const loadTag = () => {
    getTags().then((data) => {
      if (data.error) console.log(data.error);
      else {
        setValues({ ...values, tags: data });
      }
    });
  };
  const showTags = () => {
    return tags.map((tag, idx) => (
      <button
        onDoubleClick={() => deleteConfirm(tag.slug)}
        title="Double click to delete"
        key={idx}
        className="btn btn-outline-primary mr-1 ml-1 mt-3"
      >
        {tag.name}
      </button>
    ));
  };
  const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure you want to delete this tag");
    if (answer) {
      deleteTag(slug);
    }
  };
  const deleteTag = (slug) => {
    // console.log("delete", slug);
    removeTag(slug, token).then((data) => {
      if (data.error) console.log(data.error);
      else {
        setValues({
          ...values,
          error: false,
          success: false,
          name: "",
          removed: true,
          reload: !reload,
        });
      }
    });
  };
  const clickSubmit = (e) => {
    e.preventDefault();
    // console.log("create tag" + name);
    create({ name }, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          name: "",
          removed: false,
          reload: !reload,
        });
      }
    });
  };
  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: false,
    });
  };
  const showSuccess = () => {
    if (success) {
      return <p className="text-success">Tag is created</p>;
    }
  };
  const showError = () => {
    if (error) {
      return <p className="text-danger">Tag already exists</p>;
    }
  };
  const showRemoved = () => {
    if (removed) {
      return <p className="text-danger">Tag is removed</p>;
    }
  };
  const newTagForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          required
        />
      </div>
      <div className="">
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </div>
    </form>
  );
  const handleMouseMove = (e) => {
    setValues({ ...values, error: false, success: false, removed: false });
  };
  return (
    <>
      {showSuccess()}
      {showError()}
      {showRemoved()}

      <div onMouseMove={handleMouseMove}>
        {newTagForm()}
        {showTags()}
      </div>
    </>
  );
};

export default Tag;