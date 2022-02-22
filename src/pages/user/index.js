import React, { useState, useEffect } from 'react'
import styles from './index.less'
// import {
//   userTable,
//   addUser,
//   editUser,
//   changeStatus,
//   deleteUser,
//   roleList,
//   setterUser
// } from './service'
import { userTable } from './service'
import { parseTime } from '@/utils/tools'
// import {
//   Switch,
//   Table,
//   Button,
//   Popconfirm,
//   Form,
//   Modal,
//   Input,
//   Row,
//   Col,
//   Select,
//   message
// } from 'antd'
import { Switch, Table, Button, Input } from 'antd'
// import {
//   EditOutlined,
//   DeleteOutlined,
//   EyeOutlined,
//   SettingOutlined
// } from '@ant-design/icons'
const { Search } = Input
// const { Option } = Select

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
        render: record => {
          return (
            <Switch
              checked={record.mg_state}
              onChange={checked => this.handleSwitchChange(record.id, checked)}
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
      }
    ]
  }

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
  // const handleSearch = value => {
  //   // 解决useState不能及时更新,[将最新的值传递给要处理的函数]
  //   useMemo(() => {
  //     setQueryParams(queryParams => {
  //       queryParams.query = value
  //       console.log(queryParams)
  //     })
  //   }, [value])
  //   initData(queryParams)
  // }

  const handleSearch = value => {
    queryParams.query = value
    setQueryParams({ ...queryParams })
    initData(queryParams)
  }
  /**
   * 新增
   */
  const handleAdd = () => {
    console.log('user add')
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
    </div>
  )
}

User.displayName = 'User'

export default User
