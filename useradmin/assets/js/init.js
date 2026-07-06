/*
 * @轮子的作者: 轮子哥
 * @Date: 2024-06-12 15:17:37
 * @LastEditTime: 2024-06-12 15:49:15
 */
const body = document.body;
const theme = localStorage.getItem('theme')

if (theme) 
  document.documentElement.setAttribute('data-bs-theme', theme)
