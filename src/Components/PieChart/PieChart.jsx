import React, { PureComponent } from 'react';
import {
  PieChart, Pie, Sector, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { Paper, Typography } from '@mui/material';
import styles from './PieChart.module.css';

// Sample data for the pie chart
const data = [
  { name: 'Paid', value: 234 },
  { name: 'Overdue', value: 513 },
  { name: 'Unpaid', value: 354 },
];

// Define colors for each segment
const COLORS = ['#0000ff', '#808080', '#000000'];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={16} fontWeight="medium">{payload.name}</text>
      <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill={fill} fontSize={18} fontWeight="bold">{value}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.2))' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 15}
        fill={fill}
        style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

class MyPieChart extends PureComponent {
  state = {
    activeIndex: 0,  // Set initial activeIndex to 0 to zoom in on "Paid"
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    return (
      <Paper className={styles.container}>
        <div className={styles.title}>
          <Typography variant="h6" component="div" className={styles.pieTitle}>
            Invoice Statistics
          </Typography>
        </div>
        <div className={styles.chartDetails}>
          <div className={styles.chart}>
            <ResponsiveContainer width={800} height={300}>
              <PieChart>
                <Pie
                  activeIndex={this.state.activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={this.onPieEnter}
                  strokeWidth={4}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Paper>
    );
  }
}

export default MyPieChart;
