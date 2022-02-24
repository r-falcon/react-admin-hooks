import React, { useState, useEffect } from 'react'
import styles from './index.less'
import {
  userTable,
  addUser,
  editUser,
  changeStatus,
  deleteUser,
  roleList,
  setterUser
} from './service'
import { parseTime } from '@/utils/tools'
import {
  Switch,
  Table,
  Button,
  Popconfirm,
  Form,
  Modal,
  Input,
  Row,
  Col,
  Select,
  message
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons'
const { Search } = Input
const { Option } = Select

function User() {
  const [userList, setUserList] = useState([])
  const [pagination, setPagination] = useState({
    pageSizeOptions: ['1', '5', '10', '20', '30', '50'],
    defaultCurrent: 1,
    defaultPageSize: 5,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total, range) =>
      `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
  })
  const [queryParams, setQueryParams] = useState({
    query: '',
    pagenum: 1,
    pagesize: 5
  })
  const [loading, setLoading] = useState(false)

  const [visible, setVisible] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [rowId, setRowId] = useState(null)

  const [detailVisible, setDetailVisible] = useState(false)
  const [formData, setFormData] = useState({})

  const [settingVisible, setSettingVisible] = useState(false)
  const [roleData, setRoleData] = useState([])
  const [rids, setRids] = useState('')

  const getColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1}`
      },
      {
        title: '用户名',
        dataIndex: 'username',
        align: 'center'
      },
      {
        title: '角色',
        dataIndex: 'role_name',
        align: 'center'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center'
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        align: 'center'
      },
      {
        title: '启用状态',
        dataIndex: 'mg_state',
        align: 'center',
        render: (text, record) => {
          return (
            <Switch
              checked={record.mg_state}
              onChange={checked => handleSwitchChange(record.id, checked)}
            />
          )
        }
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: record => {
          return <span>{parseTime(record)}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'option',
        align: 'center',
        render: (text, record) => {
          return (
            <div>
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleUpdate(record)}
              />

              <Popconfirm
                okText="确认"
                cancelText="取消"
                title={`确认删除id为${record.id}的选项么？`}
                onConfirm={() => handleDelete(record.id)}
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
                icon={<EyeOutlined />}
                className={styles.btnStyle}
                size="small"
                onClick={() => handleDetail(record)}
              />

              <Button
                shape="circle"
                style={{ background: '#E6A23C', color: '#fff' }}
                icon={<SettingOutlined />}
                className={styles.btnStyle}
                size="small"
                onClick={() => handleSetting(record)}
              />
            </div>
          )
        }
      }
    ]
  }

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }

  const [form] = Form.useForm()

  const initData = (params = {}, paginationInfo = null) => {
    if (paginationInfo) {
      setPagination({
        ...pagination,
        current: paginationInfo.current,
        pageSize: paginationInfo.pageSize
      })
      params.pagesize = paginationInfo.pageSize
      params.pagenum = paginationInfo.current
    } else {
      params.pagesize = pagination.defaultPageSize
      params.pagenum = pagination.defaultCurrent
    }
    getList(params)
  }

  const getList = async params => {
    try {
      setLoading(true)
      const res = await userTable(params)
      setLoading(false)
      setPagination({ ...pagination, total: res.data.total })
      setUserList(res.data.users)
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  const handleTableChange = pagination => {
    console.log(pagination)
    initData(queryParams, pagination)
  }

  useEffect(() => {
    initData(queryParams)
  }, [])

  /**
   * 查询
   */
  const handleSearch = value => {
    queryParams.query = value
    setQueryParams({ ...queryParams })
    initData(queryParams)
  }

  /**
   * 新增
   */
  const handleAdd = () => {
    setVisible(true)
    setIsAdd(true)
  }

  /**
   * 修改
   */
  const handleUpdate = record => {
    form.setFieldsValue({ ...record })
    setVisible(true)
    setIsAdd(false)
    setRowId(record.id)
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
      editUser(rowId, values)
        .then(res => {
          message.success(res.meta.msg)
          reset()
          initData(queryParams)
        })
        .catch(err => console.log(err))
    } else {
      addUser(values)
        .then(res => {
          message.success(res.meta.msg)
          reset()
          initData(queryParams)
        })
        .catch(err => console.log(err))
    }
  }

  /**
   * 删除
   */
  const handleDelete = id => {
    deleteUser(id)
      .then(res => {
        message.success(res.meta.msg)
        console.log(queryParams)
        initData(queryParams)
      })
      .catch(err => console.log(err))
  }

  /**
   * 详情
   */
  const handleDetail = record => {
    setDetailVisible(true)
    setFormData({ ...record })
  }

  const clickOk = () => {
    detailReset()
  }

  const clickCancel = () => {
    detailReset()
  }

  const detailReset = () => {
    setDetailVisible(false)
    setFormData({})
  }

  /**
   * 分配权限
   */
  const handleSetting = record => {
    getRoleList()
    setSettingVisible(true)
    setFormData({ ...record })
  }

  const getRoleList = () => {
    roleList()
      .then(res => {
        setRoleData(res.data)
      })
      .catch(err => console.log(err))
  }

  const handleRoleSelect = value => {
    setRids(value)
  }

  const setOk = () => {
    if (rids === '') {
      message.success('角色没有改变')
      setReset()
    } else {
      setterUser(formData.id, rids)
        .then(res => {
          message.success(res.meta.msg)
          setReset()
          initData(queryParams)
        })
        .catch(err => console.log(err))
    }
  }

  const setCancel = () => {
    setReset()
  }

  const setReset = () => {
    setSettingVisible(false)
    setFormData({})
    setRids('')
  }

  /**
   * 启用状态改变
   */
  const handleSwitchChange = (id, checked) => {
    changeStatus(id, checked)
      .then(res => {
        message.success(res.meta.msg)
        initData(queryParams)
      })
      .catch(err => console.log(err))
  }

  return (
    <div>
      <div className={styles.header}>
        <Search
          placeholder="请输入关键字进行搜索"
          className={styles.search}
          onSearch={handleSearch}
        />
        <Button
          type="primary"
          size="small"
          className={styles.addBtn}
          onClick={handleAdd}
        >
          +新增
        </Button>
      </div>

      <Table
        bordered
        rowKey={record => record.id}
        loading={loading}
        columns={getColumns()}
        dataSource={userList}
        pagination={pagination}
        onChange={handleTableChange}
      />

      {/* 新增修改 */}
      <Modal
        title={isAdd ? '添加信息' : '修改信息'}
        visible={visible}
        footer={null}
        onCancel={onCancel}
      >
        <Form {...layout} form={form} labelAlign="left" onFinish={onFinish}>
          <Form.Item
            label="用户"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户'
              }
            ]}
          >
            <Input disabled={!isAdd} />
          </Form.Item>

          {isAdd ? (
            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码'
                }
              ]}
            >
              <Input.Password />
            </Form.Item>
          ) : null}

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              {
                required: true,
                message: '请输入邮箱'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="手机"
            name="mobile"
            rules={[
              {
                required: true,
                message: '请输入手机号'
              }
            ]}
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

      {/* 详情 */}
      <Modal
        title="详情信息"
        visible={detailVisible}
        onOk={clickOk}
        onCancel={clickCancel}
      >
        <Row>
          <Col span={12}>用户名：{formData.username}</Col>
          <Col span={12}>角 色：{formData.role_name}</Col>
          <Col span={12}>邮 箱：{formData.email}</Col>
          <Col span={12}>手 机：{formData.mobile}</Col>
          <Col span={12}>
            状 态：{formData.mg_state === true ? '启用' : '停用'}
          </Col>
        </Row>
      </Modal>

      {/* 分配权限 */}
      <Modal
        title="分配权限"
        visible={settingVisible}
        onOk={setOk}
        onCancel={setCancel}
      >
        <p>当前用户：{formData.username}</p>
        <p>当前角色：{formData.role_name}</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          分配角色：
          <Select
            style={{ width: '50%' }}
            defaultValue={formData.role_name}
            onChange={handleRoleSelect}
          >
            {roleData.map(item => (
              <Option key={item.id} value={item.id}>
                {item.roleName}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  )
}

User.displayName = 'User'

export default User
