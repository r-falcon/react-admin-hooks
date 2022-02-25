import React, { useState, useEffect } from 'react'
import { rightList } from './service'
import { Table, Tag } from 'antd'

function Rights() {
  const [allRightsList, setAllRightsList] = useState([])
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
        title: '权限名称',
        dataIndex: 'authName',
        align: 'center'
      },
      {
        title: '权限路径',
        dataIndex: 'path',
        align: 'center'
      },
      {
        title: '权限等级',
        dataIndex: 'level',
        align: 'center',
        render: (text, record) =>
          record.level === '0' ? (
            <Tag color="red">一级</Tag>
          ) : record.level === '1' ? (
            <Tag color="green">二级</Tag>
          ) : (
            <Tag color="orange">三级</Tag>
          )
      }
    ]
  }

  useEffect(() => {
    getRightsList('list')
  }, [])

  const getRightsList = type => {
    setLoading(true)
    rightList(type)
      .then(res => {
        setLoading(false)
        setAllRightsList(res.data)
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }

  return (
    <div>
      <Table
        bordered
        rowKey={record => record.id}
        columns={getColumns()}
        loading={loading}
        dataSource={allRightsList}
      ></Table>
    </div>
  )
}

Rights.displayName = 'Rights'
export default Rights
