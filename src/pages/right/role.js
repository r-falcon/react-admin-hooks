import React, { useState, useEffect } from 'react'
import {
  roleList,
  deleteAssignRole,
  addRole,
  editRole,
  deleteRole,
  rightList,
  setRole
} from './service'
import {
  Table,
  Button,
  Tag,
  Row,
  Col,
  Popconfirm,
  Modal,
  Form,
  Input,
  Tree,
  message
} from 'antd'
import {
  CaretRightFilled,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined
} from '@ant-design/icons'
import styles from './role.less'

function Role() {
  const [allRoleList, setAllRoleList] = useState([])
  const [loading, setLoading] = useState(false)

  const [rowId, setRowId] = useState(null)

  const [isAdd, setIsAdd] = useState(false)
  const [visible, setVisible] = useState(false)

  const [settingVisible, setSettingVisible] = useState(false)
  const [rightsTree, setRightsTree] = useState([])
  const [defkeys, setDefKeys] = useState([])
  const [idStr, setIdStr] = useState('')

  const [form] = Form.useForm()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }
  const replaceFields = { children: 'children', title: 'authName', key: 'id' }

  const getColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1}`
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
        align: 'center'
      },
      {
        title: '角色描述',
        dataIndex: 'roleDesc',
        align: 'center'
      },
      {
        title: '操作',
        dataIndex: 'option',
        align: 'center',
        render: (text, record) => (
          <div>
            <Button
              type="primary"
              shape="circle"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record)}
            />

            <Popconfirm
              onConfirm={() => handleDelete(record.id)}
              okText="确认"
              title={`确认删除id为${record.id}的选项么？`}
              cancelText="取消"
            >
              <Button
                shape="circle"
                type="danger"
                className={styles.btnStyle}
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>

            <Button
              shape="circle"
              style={{ background: '#E6A23C', color: '#fff' }}
              size="small"
              icon={<SettingOutlined />}
              className={styles.btnStyle}
              onClick={() => handleSetting(record)}
            />
          </div>
        )
      }
    ]
  }

  useEffect(() => {
    getRoleList()
  }, [])

  const getRoleList = () => {
    setLoading(true)
    roleList()
      .then(res => {
        setLoading(false)
        const role_show = []
        res.data.map(item => {
          role_show.push({
            id: item.id,
            roleName: item.roleName,
            roleDesc: item.roleDesc,
            expandable: item.children.length > 0,
            params: item.children.length > 0 ? item.children : []
          })
        })
        setAllRoleList(role_show)
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }

  /**
   * 添加
   */
  const handleAdd = () => {
    setIsAdd(true)
    setVisible(true)
  }

  /**
   * 修改
   */
  const handleUpdate = record => {
    setIsAdd(false)
    setVisible(true)
    setRowId(record.id)
    form.setFieldsValue({ ...record })
  }

  const onCancel = () => {
    reset()
  }

  const reset = () => {
    form.resetFields()
    setVisible(false)
    setRowId(null)
  }

  const onFinish = values => {
    if (rowId) {
      editRole(rowId, values)
        .then(res => {
          message.success(res.meta.msg)
          reset()
          getRoleList()
        })
        .catch(err => console.log(err))
    } else {
      addRole(values)
        .then(res => {
          message.success(res.meta.msg)
          reset()
          getRoleList()
        })
        .catch(err => console.log(err))
    }
  }

  /**
   * 删除
   */
  const handleDelete = recordId => {
    deleteRole(recordId)
      .then(res => {
        message.success(res.meta.msg)
        getRoleList()
      })
      .catch(err => console.log(err))
  }

  /**
   * 分配权限
   */
  const handleSetting = record => {
    getRightsTree(record)
    setSettingVisible(true)
    setRowId(record.id)
  }

  const getRightsTree = record => {
    const newRecord = JSON.parse(
      JSON.stringify(record).replace(/params/g, 'children')
    )

    rightList('tree')
      .then(res => {
        const keys = []
        getLeafKeys(newRecord, keys)
        setRightsTree(res.data)
        setDefKeys(keys)
      })
      .catch(err => console.log(err))
  }

  const getLeafKeys = (node, arr) => {
    if (!node.children) {
      return arr.push(node.id)
    }
    node.children.map(item => {
      getLeafKeys(item, arr)
    })
  }

  const handleTreeCheck = (checkedKeys, info) => {
    const allChecked = [...checkedKeys, ...info.halfCheckedKeys]
    const strs = allChecked.join(',')
    setDefKeys(checkedKeys)
    setIdStr(strs)
  }

  /**
   * table-expandrowrender
   */
  const expandedRowRender = record => {
    return (
      <div>
        {record.params.map((item1, index1) => (
          <Row
            key={item1.id}
            className={`${styles.bdbottom} ${styles.vcenter} ${
              index1 === 0 ? 'bdtop' : ''
            }`}
          >
            <Col span={5}>
              <Tag
                className={styles.tag}
                color="blue"
                closable
                onClose={() => handleTagDelete(record.id, item1.id)}
              >
                {item1.authName}
              </Tag>
              <CaretRightFilled />
            </Col>

            <Col span={19}>
              {item1.children.map((item2, index2) => (
                <Row
                  key={item2.id}
                  className={`${styles.vcenter} ${index2 === 0 ? '' : 'bdtop'}`}
                >
                  <Col span={6}>
                    <Tag
                      className={styles.tag}
                      color="green"
                      closable
                      onClose={() => handleTagDelete(record.id, item2.id)}
                    >
                      {item2.authName}
                    </Tag>
                    <CaretRightFilled />
                  </Col>

                  <Col span={18}>
                    {item2.children.map(item3 => (
                      <Tag
                        className={styles.tag}
                        color="orange"
                        key={item3.id}
                        closable
                        onClose={() => handleTagDelete(record.id, item3.id)}
                      >
                        {item3.authName}
                      </Tag>
                    ))}
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        ))}
      </div>
    )
  }

  /**
   * 删除指定角色权限
   */
  const handleTagDelete = (roleId, rightId) => {
    deleteAssignRole(roleId, rightId)
      .then(res => {
        message.success(res.meta.msg)
      })
      .catch(err => console.log(err))
  }

  const setOk = () => {
    setRole(rowId, idStr)
      .then(res => {
        message.success(res.meta.msg)
        setReset()
        getRoleList()
      })
      .catch(err => console.log(err))
  }

  const setCancel = () => {
    setReset()
  }

  const setReset = () => {
    setSettingVisible(false)
    setRowId(null)
    setDefKeys([])
    setIdStr('')
  }

  return (
    <div>
      <Button
        type="primary"
        size="small"
        className={styles.addBtn}
        onClick={handleAdd}
      >
        + 添加
      </Button>

      <Table
        bordered
        rowKey={record => record.id}
        columns={getColumns()}
        loading={loading}
        dataSource={allRoleList}
        expandable={{
          expandedRowRender: record => expandedRowRender(record),
          rowExpandable: record => record.expandable
        }}
      ></Table>

      <Modal
        title={isAdd ? '添加角色' : '修改角色'}
        visible={visible}
        footer={null}
        onCancel={onCancel}
      >
        <Form {...layout} labelAlign="left" form={form} onFinish={onFinish}>
          <Form.Item
            label="角色名称"
            name="roleName"
            rules={[{ required: true, message: '请填写角色名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="角色描述"
            name="roleDesc"
            rules={[{ required: true, message: '请填写角色描述' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="分配权限"
        visible={settingVisible}
        onOk={setOk}
        onCancel={setCancel}
      >
        <Tree
          checkable
          treeData={rightsTree}
          fieldNames={replaceFields}
          checkedKeys={defkeys}
          autoExpandParent={true}
          onCheck={handleTreeCheck}
        />
      </Modal>
    </div>
  )
}

Role.displayName = 'Role'
export default Role
