package com.remoteconfig.data.model

import kotlinx.serialization.Serializable

/**
 * 앱 툴바 데이터 모델
 * Config API에서 받은 toolbar 정보를 담는 클래스
 */
@Serializable
data class AppToolbar(
    val id: String,
    val appId: String,
    val toolbarId: String,
    val title: String,
    val position: String, // "top", "bottom"
    val backgroundColor: String? = "#FFFFFF",
    val textColor: String? = "#007AFF",
    val height: Int? = 64,
    val isVisible: Boolean = true,
    val buttons: List<ToolbarButton> = emptyList(),
    val createdAt: String? = null,
    val updatedAt: String? = null
)

/**
 * 툴바 버튼 데이터 모델
 * buttons JSON 배열의 각 버튼 정보를 담는 클래스
 */
@Serializable
data class ToolbarButton(
    val id: String,
    val icon: String,
    val title: String,
    val action: String,
    val isEnabled: Boolean = true,
    val isVisible: Boolean = true,
    val order: Int? = null
)

/**
 * Config API 응답 모델
 */
@Serializable
data class ConfigResponse(
    val message: String,
    val timestamp: String,
    val appId: String,
    val app: AppInfo,
    val menus: List<AppMenu>,
    val toolbars: List<AppToolbar>,
    val fcmTopics: List<FcmTopic>,
    val styles: List<AppStyle>
)

@Serializable
data class AppInfo(
    val id: String,
    val appName: String,
    val appId: String,
    val packageName: String,
    val version: String,
    val description: String,
    val status: String,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class AppMenu(
    val id: String,
    val appId: String,
    val menuId: String,
    val title: String,
    val icon: String,
    val orderIndex: Int,
    val parentId: String? = null,
    val menuType: String,
    val actionType: String,
    val actionValue: String,
    val isVisible: Boolean = true,
    val isEnabled: Boolean = true,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class FcmTopic(
    val id: String,
    val appId: String,
    val topicName: String,
    val topicId: String,
    val description: String,
    val isDefault: Boolean = false,
    val isActive: Boolean = true,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class AppStyle(
    val id: String,
    val appId: String,
    val styleKey: String,
    val styleValue: String,
    val styleCategory: String,
    val description: String,
    val createdAt: String,
    val updatedAt: String
) 