import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function debounce(fn: Function, delay: number){
  let timer: any
  return  (...args: any) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(null, args)
    }, delay)
  }
}

export function getItemFromLocalStorage(item: string) {
  const data = localStorage.getItem(item)
  if (data) {
    return JSON.parse(data)
  }
  return null
}

export function setItemToLocalStorage(item: string, kvs: Record<string, any>) {
  const data = localStorage.getItem(item)
  if (data) {
    localStorage.setItem(item, JSON.stringify({
      ...JSON.parse(data),
      ...kvs,
    }))
  } else {
    localStorage.setItem(item, JSON.stringify({
      ...kvs,
    }
    ))
  }
}