import React, { useState, useEffect } from 'react'
import { goodsList, goodsDelete } from './service'
import { Table, Button, Input, Popconfirm, message } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import router from 'umi/router'
import { parseTime } from '@/utils/tools'

const { Search } = Input

function Goods() {
  const [queryParams, setQueryParams] = useState({
    query: '',
    pagenum: 1,
    pagesize: 5
  })
  const [allList, setAllList] = useState([])
  const [pagination, setPagination] = useState({
    pageSizeOptions: ['5', '10', '20', '50'],
    defaultCurrent: 1,
    defaultPageSize: 5,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total, range) =>
      `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
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
        title: '商品名称',
        dataIndex: 'goods_name',
        align: 'center'
      },
      {
        title: '商品价格',
        dataIndex: 'goods_price',
        align: 'center'
      },
      {
        title: '商品数量',
        dataIndex: 'goods_number',
        align: 'center'
      },
      {
        title: '商品重量',
        dataIndex: 'goods_weight',
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'add_time',
        align: 'center',
        render: (text, record) => parseTime(record.add_time)
      },
      {
        title: '操作',
        dataIndex: 'option',
        align: 'center',
        width: 200,
        render: (text, record) => {
          return (
            <div>
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => handleUpdate(record.goods_id)}
              />

              <Popconfirm
                onConfirm={() => handleDelete(record.goods_id)}
                okText="确认"
                title={`确认删除id为${record.goods_id}的选项么？`}
                cancelText="取消"
              >
                <Button
                  shape="circle"
                  type="danger"
                  size="small"
                  style={{ marginLeft: '20px' }}
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </div>
          )
        }
      }
    ]
  }

  useEffect(() => {
    initData(queryParams)
  }, [])

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

  const getList = params => {
    setLoading(true)
    goodsList(params)
      .then(res => {
        setLoading(false)
        setPagination({ ...pagination, total: res.data.total })
        setAllList(res.data.goods)
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }
  /**
   * 新增
   */
  const handleAdd = () => {
    router.push('/goods/add')
  }

  /**
   * 修改
   */
  const handleUpdate = goodsId => {
    router.push({ pathname: '/goods/add', query: { goodsId: goodsId } })
  }

  /**
   * 删除
   */
  const handleDelete = goodsId => {
    goodsDelete(goodsId)
      .then(res => {
        message.success(res.meta.msg)
        initData(queryParams)
      })
      .catch(err => console.log(err))
  }

  /**
   * 分页变动
   */
  const handleTableChange = pagination => {
    initData(queryParams, pagination)
  }

  /**
   * 查询
   */
  const handleSearch = value => {
    queryParams.query = value
    setQueryParams({ ...queryParams })
    initData(queryParams)
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '10px 0'
        }}
      >
        <Search
          placeholder="请输入搜索关键字"
          style={{ width: '240px' }}
          onSearch={handleSearch}
        />

        <Button
          type="primary"
          size="small"
          style={{ fontSize: '12px' }}
          onClick={handleAdd}
        >
          + 新增
        </Button>
      </div>

      <Table
        bordered
        rowKey={record => record.goods_id}
        loading={loading}
        dataSource={allList}
        columns={getColumns()}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  )
}

Goods.displayName = 'Goods'
export default Goods
